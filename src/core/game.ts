import { EVENTS, type HistEvent } from '../data/events';
import { ERA_IDS, type EraId, type Stage } from '../data/eras';
import { personById } from '../data/people';
import { dayIndex } from './date';
import { GAME_EVENTS } from './rewards';
import { hashString, rngFromString, shuffle } from './rng';

/** 人物がいないできごと (縄文時代など) は、1 回のゲームにこの枚数まで */
export const MAX_NO_PEOPLE = 2;
/** 1 つのできごとの下にならべる人物カードの数の上限 */
export const MAX_PEOPLE = 3;
/** 今日のチャレンジで、何個の時代から 1 枚ずつ取るか */
const DAILY_ERAS = GAME_EVENTS;

export interface GameCard {
  /** できごとは `e:<できごとの id>`、人物は `p:<できごとの id>:<人物の id>` */
  id: string;
  kind: 'event' | 'person';
  /** ふりがな付きの表示名 */
  label: string;
  /** 正しい列 (年表の左から何番目か。0 から数える) */
  column: number;
  personId?: string;
}

export interface Game {
  id: string;
  kind: 'daily' | 'stage';
  /** 年の順にならべたできごと。列の順でもある */
  events: HistEvent[];
  /** events[i] の列にならべる人物の id */
  people: string[][];
  /** 手札 (はじめのならび。シャッフルしてある) */
  hand: GameCard[];
  /** どのカードが出ているか。データが変わって中身が入れかわったら、途中経過は使わない */
  sig: string;
  /** 時代の練習が何回目か */
  round?: number;
}

export const dailyId = (date: string) => `daily-${date}`;
export const stageGameId = (stageId: string) => `stage-${stageId}`;

/**
 * 2 つのできごとを同じゲームに出すと、どちらが先か決められないか。
 * - 同じ年のもの (1185 年の「壇ノ浦の戦い」と「鎌倉幕府」など)
 * - 期間の中に入るもの (「弥生時代」と「卑弥呼が魏に使いを送る」など)
 * 期間どうし (縄文時代と弥生時代など) は、さかい目でふれているだけならよい。
 */
export function conflicts(a: HistEvent, b: HistEvent): boolean {
  if (a.from === b.from) return true;
  const aEnd = a.to ?? a.from;
  const bEnd = b.to ?? b.from;
  if (a.to !== undefined && b.to !== undefined) return a.from < bEnd && b.from < aEnd;
  return a.from <= bEnd && b.from <= aEnd;
}

type Picked = { event: HistEvent; people: string[] }[];

/** event を chosen に足せるなら、そのとき出す人物。足せなければ null */
function fit(chosen: Picked, event: HistEvent): string[] | null {
  if (chosen.some((c) => c.event.id === event.id || conflicts(c.event, event))) return null;
  if (event.people.length === 0) return chosen.filter((c) => c.event.people.length === 0).length < MAX_NO_PEOPLE ? [] : null;
  const used = new Set(chosen.flatMap((c) => c.people));
  const people = event.people.slice(0, MAX_PEOPLE).filter((p) => !used.has(p));
  return people.length > 0 ? people : null;
}

/**
 * 候補の前のほうから、いっしょに出せる 5 枚をえらぶ。
 * 同じ人物が 2 つの列に出ないよう、もうほかの列に出た人物は外す。
 * そのせいで人物がいなくなるできごと (信長だけの「安土城」と「桶狭間」など) はえらばない。
 * 前から順に取って 5 枚にならないときは、取り方を変えてさがす (できるだけ前のほうの候補を使う)。
 */
function pick(candidates: readonly HistEvent[]): Picked {
  let steps = 0;
  let best: Picked = [];
  const search = (start: number, chosen: Picked): Picked | null => {
    if (chosen.length > best.length) best = chosen;
    if (chosen.length === GAME_EVENTS) return chosen;
    for (let i = start; i < candidates.length && steps++ < 50_000; i++) {
      const people = fit(chosen, candidates[i]);
      if (!people) continue;
      const found = search(i + 1, [...chosen, { event: candidates[i], people }]);
      if (found) return found;
    }
    return null;
  };
  return search(0, []) ?? best;
}

/** その時代の練習に出るできごと ('all' は全部) */
export function stagePool(stageId: Stage['id']): HistEvent[] {
  return stageId === 'all' ? EVENTS : EVENTS.filter((e) => e.era === stageId);
}

/** 列の cycle 巡目のならび。同じ種と巡なら、いつも同じならびになる */
function deckOrder(pool: readonly HistEvent[], seed: string, cycle: number): HistEvent[] {
  return shuffle(pool, rngFromString(`${seed}:${cycle}`));
}

function build(id: string, kind: Game['kind'], picked: Picked, round?: number): Game {
  const columns = picked.slice().sort((a, b) => a.event.from - b.event.from);
  const cards: GameCard[] = [];
  columns.forEach(({ event, people }, column) => {
    cards.push({ id: `e:${event.id}`, kind: 'event', label: event.title, column });
    for (const p of people) {
      cards.push({ id: `p:${event.id}:${p}`, kind: 'person', label: personById(p)?.name ?? p, column, personId: p });
    }
  });
  return {
    id,
    kind,
    events: columns.map((c) => c.event),
    people: columns.map((c) => c.people),
    hand: shuffle(cards, rngFromString(`${id}:${round ?? 0}:hand`)),
    sig: hashString(cards.map((c) => c.id).join('|')).toString(36),
    ...(round !== undefined ? { round } : {}),
  };
}

/**
 * 時代の練習の round 回目 (0 から数える)。
 * 時代のできごとをならべかえた列の前から 5 枚ずつ取り、取った分は次の巡のならびで列の後ろにおぎなう。
 * いっしょに出せずに飛ばしたものは列の前に残り、次の回に先に出る。なので一巡するまで、同じできごとはほぼ出ない。
 * 記録を持たずに計算で決めるため、0 回目から順にたどる (回数は多くても数百なので、すぐ終わる)。
 */
export function stageGame(stage: Stage, round: number): Game {
  const pool = stagePool(stage.id);
  const seed = stageGameId(stage.id);
  const queue: HistEvent[] = [];
  let cycle = 0;
  let picked: Picked = [];
  for (let r = 0; r <= round; r++) {
    // まだ出ていないものは列に残したまま、次の巡のならびで足りない分をおぎなう (列に同じものは 2 つ入れない)
    while (queue.length < pool.length) {
      for (const event of deckOrder(pool, seed, cycle++)) if (!queue.includes(event)) queue.push(event);
    }
    picked = pick(queue);
    for (const { event } of picked) queue.splice(queue.indexOf(event), 1);
  }
  return build(seed, 'stage', picked, round);
}

/**
 * 今日のチャレンジ。日本時間の日付から、7 つの時代のうち 5 つをえらび、それぞれから 1 枚ずつ出す。
 * 時代ごとの列の dayIndex 番目から取るので、前の日の続きになり、だれが開いても同じになる。
 * いっしょに出せないものがあれば、その次の日の分をくり上げて使う。
 */
export function dailyGame(date: string): Game {
  const day = dayIndex(date);
  const eras = shuffle(ERA_IDS, rngFromString(dailyId(date))).slice(0, DAILY_ERAS);
  const pools = new Map<EraId, HistEvent[]>(eras.map((era) => [era, stagePool(era)]));
  const at = (era: EraId, position: number): HistEvent => {
    const pool = pools.get(era)!;
    return deckOrder(pool, `daily-${era}`, Math.floor(position / pool.length))[position % pool.length];
  };
  const candidates: HistEvent[] = [];
  const longest = Math.max(...[...pools.values()].map((p) => p.length));
  for (let k = 0; k < longest; k++) for (const era of eras) candidates.push(at(era, day + k));
  return build(dailyId(date), 'daily', pick(candidates));
}

export type PlaceResult =
  /** 正しい場所 */
  | 'ok'
  /** まちがい (ミスに数える) */
  | 'wrong'
  /** この人物はこの列のできごとにも関係があるが、今回はほかの列に置く (ミスには数えない) */
  | 'elsewhere'
  /** そこには置けない (うまっている枠、できごとがまだない列) */
  | 'invalid';

/** カードを column の列に置いたらどうなるか。placed は、もう正しく置いたカードの id */
export function tryPlace(game: Game, placed: ReadonlySet<string>, cardId: string, column: number): PlaceResult {
  const card = game.hand.find((c) => c.id === cardId);
  if (!card || placed.has(cardId) || column < 0 || column >= game.events.length) return 'invalid';
  const eventPlaced = placed.has(`e:${game.events[column].id}`);
  if (card.kind === 'event') {
    if (eventPlaced) return 'invalid';
    return card.column === column ? 'ok' : 'wrong';
  }
  if (!eventPlaced) return 'invalid';
  if (card.column === column) return 'ok';
  return game.events[column].people.includes(card.personId!) ? 'elsewhere' : 'wrong';
}

/** 途中経過の placed から、このゲームにないカードを取りのぞく (データが変わったときのため) */
export function validPlaced(game: Game, placed: readonly string[]): string[] {
  const ids = new Set(game.hand.map((c) => c.id));
  return [...new Set(placed)].filter((id) => ids.has(id));
}

export function isComplete(game: Game, placed: readonly string[]): boolean {
  return validPlaced(game, placed).length === game.hand.length;
}
