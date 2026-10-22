import { describe, expect, it } from 'vitest';
import { MAX_PEOPLE } from '../src/core/game';
import { ERA_IDS, STAGES } from '../src/data/eras';
import { EVENTS } from '../src/data/events';
import { PEOPLE } from '../src/data/people';

/** ふりがなをはずした文。半角かっこが残っていたら、書きまちがい */
const stripRuby = (s: string) => s.replace(/([一-龠々ヶノ]+)\(([ぁ-ん]+)\)/g, '$1');

describe('できごとと人物のデータ', () => {
  it('id が重ならない', () => {
    expect(new Set(EVENTS.map((e) => e.id)).size).toBe(EVENTS.length);
    expect(new Set(PEOPLE.map((p) => p.id)).size).toBe(PEOPLE.length);
    expect(new Set(PEOPLE.map((p) => stripRuby(p.name))).size).toBe(PEOPLE.length);
  });

  it('人物の id がみな登録されていて、登録した人物はどこかで使われている', () => {
    const ids = new Set(PEOPLE.map((p) => p.id));
    const used = new Set(EVENTS.flatMap((e) => e.people));
    for (const e of EVENTS) {
      for (const p of e.people) expect(ids.has(p), `${e.id} の ${p}`).toBe(true);
      expect(new Set(e.people).size, e.id).toBe(e.people.length);
      expect(e.people.length, e.id).toBeLessThanOrEqual(MAX_PEOPLE);
    }
    for (const p of PEOPLE) expect(used.has(p.id), p.id).toBe(true);
  });

  it('年と時代が正しく書かれている', () => {
    for (const e of EVENTS) {
      expect(Number.isInteger(e.from), e.id).toBe(true);
      if (e.to !== undefined) expect(e.to, e.id).toBeGreaterThan(e.from);
      expect(e.when.trim(), e.id).not.toBe('');
      expect(ERA_IDS, e.id).toContain(e.era);
      // 「○年」と書いたものは、from と同じ年
      const year = e.when.match(/^(\d+)年/);
      if (year && e.to === undefined) expect(Number(year[1]), e.id).toBe(e.from);
    }
  });

  it('時代の中では年の順にならべて書いてある (データを見直しやすくするため)', () => {
    for (const era of ERA_IDS) {
      const years = EVENTS.filter((e) => e.era === era).map((e) => e.from);
      expect(years, era).toEqual(years.slice().sort((a, b) => a - b));
    }
    const all = EVENTS.map((e) => e.from);
    expect(all).toEqual(all.slice().sort((a, b) => a - b));
  });

  it('ふりがなの書き方が正しい (説明のかっこは全角)', () => {
    const texts = [...EVENTS.flatMap((e) => [e.title, e.note]), ...PEOPLE.map((p) => p.name), ...STAGES.map((s) => s.title)];
    for (const t of texts) expect(stripRuby(t), t).not.toMatch(/[()]/);
  });

  it('できごとの名前に、その人物の名前が入っていない (答えが分かってしまう)', () => {
    for (const e of EVENTS) {
      const title = stripRuby(e.title);
      for (const id of e.people) {
        const name = stripRuby(PEOPLE.find((p) => p.id === id)!.name);
        // 「島原・天草一揆」は、できごとの名前そのものなので例外
        if (e.id === 'shimabara') continue;
        expect(title.includes(name), `${e.id} に ${name}`).toBe(false);
      }
    }
  });
});
