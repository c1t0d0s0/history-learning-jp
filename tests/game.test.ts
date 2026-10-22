import { describe, expect, it } from 'vitest';
import { addDays } from '../src/core/date';
import { MAX_NO_PEOPLE, conflicts, dailyGame, isComplete, stageGame, stagePool, tryPlace, type Game } from '../src/core/game';
import { GAME_EVENTS } from '../src/core/rewards';
import { STAGES } from '../src/data/eras';
import { eventById } from '../src/data/events';

/** 1 回のゲームが守るべき決まり */
function checkGame(game: Game, label: string): void {
  expect(game.events.length, label).toBe(GAME_EVENTS);
  // 年の順にならんでいて、どの 2 枚も順番が決められる
  for (let i = 0; i < game.events.length; i++) {
    for (let j = i + 1; j < game.events.length; j++) {
      expect(conflicts(game.events[i], game.events[j]), `${label}: ${game.events[i].id} と ${game.events[j].id}`).toBe(false);
      expect(game.events[i].from, label).toBeLessThan(game.events[j].from);
    }
  }
  // 人物は 2 つの列に出ない。人物のいるできごとには、少なくとも 1 人出る
  const people = game.people.flat();
  expect(new Set(people).size, label).toBe(people.length);
  game.events.forEach((e, i) => {
    if (e.people.length > 0) expect(game.people[i].length, `${label}: ${e.id}`).toBeGreaterThan(0);
    for (const p of game.people[i]) expect(e.people).toContain(p);
  });
  expect(game.events.filter((e) => e.people.length === 0).length, label).toBeLessThanOrEqual(MAX_NO_PEOPLE);
  expect(game.hand.length, label).toBe(GAME_EVENTS + people.length);
  expect(new Set(game.hand.map((c) => c.id)).size, label).toBe(game.hand.length);
}

describe('年の順番が決められるか', () => {
  const e = (id: string) => eventById(id)!;
  it('同じ年・期間の中のものは、いっしょに出さない', () => {
    expect(conflicts(e('dannoura'), e('kamakura'))).toBe(true);
    expect(conflicts(e('yayoi'), e('himiko'))).toBe(true);
    expect(conflicts(e('yayoi'), e('kinin'))).toBe(true);
  });
  it('となりあう期間や、はなれた年のものは出してよい', () => {
    expect(conflicts(e('paleolithic'), e('jomon'))).toBe(false);
    expect(conflicts(e('jomon'), e('yayoi'))).toBe(false);
    expect(conflicts(e('jomon'), e('kinin'))).toBe(false);
    expect(conflicts(e('kofun'), e('yayoi'))).toBe(false);
    expect(conflicts(e('sekigahara'), e('edo-bakufu'))).toBe(false);
  });
});

describe('今日のチャレンジ', () => {
  it('1 年分、毎日決まりを守った 5 枚が出る', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 366; i++) {
      const date = addDays('2026-01-01', i);
      const game = dailyGame(date);
      checkGame(game, date);
      expect(game.id).toBe(`daily-${date}`);
      for (const ev of game.events) seen.add(ev.id);
      // 5 枚は 4 つ以上の時代から出る
      expect(new Set(game.events.map((ev) => ev.era)).size, date).toBeGreaterThanOrEqual(4);
    }
    // 1 年あれば、ほとんどのできごとが出る
    expect(seen.size).toBeGreaterThan(stagePool('all').length * 0.9);
  });

  it('同じ日ならいつも同じで、次の日はちがう', () => {
    expect(dailyGame('2026-10-22')).toEqual(dailyGame('2026-10-22'));
    expect(dailyGame('2026-10-22').sig).not.toBe(dailyGame('2026-10-23').sig);
  });
});

describe('時代の練習', () => {
  for (const stage of STAGES) {
    it(`${stage.id}: 決まりを守った 5 枚が出て、一巡で全部出る`, () => {
      const pool = stagePool(stage.id);
      const rounds = Math.ceil(pool.length / GAME_EVENTS);
      const firstCycle = new Set<string>();
      for (let r = 0; r < Math.max(30, rounds * 3); r++) {
        const game = stageGame(stage, r);
        checkGame(game, `${stage.id} ${r}`);
        expect(game.round).toBe(r);
        // 続けて 2 回、同じ組み合わせにはならない
        if (r > 0) expect(game.sig, `${stage.id} ${r}`).not.toBe(stageGame(stage, r - 1).sig);
        if (r < rounds + 2) for (const ev of game.events) firstCycle.add(ev.id);
      }
      // いっしょに出せずに飛ばしたものも、少しおくれて出る
      expect(firstCycle.size, stage.id).toBeGreaterThanOrEqual(Math.min(pool.length, (rounds + 2) * GAME_EVENTS) * 0.9);
      expect(stageGame(stage, 3)).toEqual(stageGame(stage, 3));
    });
  }
});

describe('カードを置く', () => {
  const game = dailyGame('2026-10-22');
  const eventCard = (col: number) => game.hand.find((c) => c.kind === 'event' && c.column === col)!;
  const personCard = game.hand.find((c) => c.kind === 'person')!;

  it('できごとは正しい順の枠にだけ置ける', () => {
    const placed = new Set<string>();
    expect(tryPlace(game, placed, eventCard(0).id, 0)).toBe('ok');
    expect(tryPlace(game, placed, eventCard(0).id, 1)).toBe('wrong');
    placed.add(eventCard(0).id);
    expect(tryPlace(game, placed, eventCard(0).id, 0)).toBe('invalid'); // もう置いた
    expect(tryPlace(game, placed, eventCard(1).id, 0)).toBe('invalid'); // うまっている
  });

  it('人物は、できごとを置いた列にだけ置ける', () => {
    const placed = new Set<string>();
    const col = personCard.column;
    const other = (col + 1) % GAME_EVENTS;
    expect(tryPlace(game, placed, personCard.id, col)).toBe('invalid');
    placed.add(eventCard(col).id);
    placed.add(eventCard(other).id);
    expect(tryPlace(game, placed, personCard.id, col)).toBe('ok');
    expect(['wrong', 'elsewhere']).toContain(tryPlace(game, placed, personCard.id, other));
  });

  it('ほかのできごとにも関係する人物は、ミスにしない', () => {
    // 織田信長は、桶狭間にも本能寺にも関係がある
    for (let r = 0; r < 60; r++) {
      const g = stageGame(STAGES.find((s) => s.id === 'sengoku')!, r);
      const nobu = g.hand.find((c) => c.personId === 'nobunaga');
      if (!nobu) continue;
      const otherCol = g.events.findIndex((e, i) => i !== nobu.column && e.people.includes('nobunaga'));
      if (otherCol < 0) continue;
      const placed = new Set(g.hand.filter((c) => c.kind === 'event').map((c) => c.id));
      expect(tryPlace(g, placed, nobu.id, otherCol)).toBe('elsewhere');
      return;
    }
    throw new Error('信長が 2 つの列に関係するゲームが見つからない');
  });

  it('全部置いたらクリア', () => {
    expect(isComplete(game, game.hand.map((c) => c.id))).toBe(true);
    expect(isComplete(game, game.hand.slice(1).map((c) => c.id))).toBe(false);
    expect(isComplete(game, [...game.hand.slice(1).map((c) => c.id), 'e:unknown'])).toBe(false);
  });
});
