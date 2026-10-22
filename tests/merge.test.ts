import { describe, expect, it } from 'vitest';
import { mergeCards, mergeProgress, mergeSnapshots, sameSnapshot } from '../src/core/merge';
import { CLEAR_POINTS, earnedPoints } from '../src/core/rewards';
import {
  emptySnapshot,
  fromAppDoc,
  fromProgressDoc,
  hasRecords,
  toAppDoc,
  toProgressDoc,
  type Progress,
  type Snapshot,
} from '../src/core/snapshot';

const snap = (part: Partial<Snapshot>): Snapshot => ({ ...emptySnapshot(), ...part });
const prog = (placed: string[], part: Partial<Progress> = {}): Progress => ({ sig: 's', placed, mistakes: 0, done: false, ...part });
/** 残高の計算 (storage.ts の balance と同じ式) */
const balance = (s: Snapshot) => s.clears.length * CLEAR_POINTS + earnedPoints(s.stamps).total - s.cards.reduce((sum, c) => sum + c.paid, 0);

describe('2 か所の記録を合わせる', () => {
  it('スタンプとクリアは、両方を合わせた集合になる', () => {
    const a = snap({ stamps: ['2026-10-01', '2026-10-02'], clears: ['stage-ancient', 'daily-2026-10-01'] });
    const b = snap({ stamps: ['2026-10-02', '2026-10-03'], clears: ['stage-edo', 'stage-ancient'] });
    const m = mergeSnapshots(a, b);
    expect(m.stamps).toEqual(['2026-10-01', '2026-10-02', '2026-10-03']);
    expect(m.clears).toEqual(['daily-2026-10-01', 'stage-ancient', 'stage-edo']);
  });

  it('カードは両方を合わせ、同じカードは払った額の小さいほう', () => {
    expect(mergeCards([{ id: 'c01', paid: 100 }, { id: 'c03', paid: 300 }], [{ id: 'c01', paid: 40 }, { id: 'c02', paid: 80 }])).toEqual([
      { id: 'c01', paid: 40 },
      { id: 'c02', paid: 80 },
      { id: 'c03', paid: 300 },
    ]);
  });

  it('途中経過は、クリア済みを優先する', () => {
    const done = prog(['c0', 'c1', 'c2'], { done: true, at: 1 });
    const playing = prog(['c0', 'c1'], { at: 9 });
    expect(mergeProgress(done, playing).done).toBe(true);
    expect(mergeProgress(playing, done).placed).toEqual(['c0', 'c1', 'c2']);
  });

  it('どちらも途中なら、多く置いているほう', () => {
    const more = prog(['c3', 'c1'], { at: 1 });
    const less = prog(['c3'], { at: 9 });
    expect(mergeProgress(more, less).placed).toEqual(['c3', 'c1']);
    expect(mergeProgress(less, more).placed).toEqual(['c3', 'c1']);
    expect(mergeProgress(less, more).at).toBe(9);
  });

  it('置いた数が同じなら、ミスが多いほう (ミスは取り消せない)', () => {
    const a = prog(['c1'], { mistakes: 2, at: 1 });
    const b = prog(['c1'], { mistakes: 0, at: 9 });
    expect(mergeProgress(a, b).mistakes).toBe(2);
    expect(mergeProgress(b, a).mistakes).toBe(2);
  });

  it('練習の回がちがえば、進んでいるほう (古い回のクリア済みや、あとから保存したものより優先)', () => {
    const before = prog(['c0', 'c1', 'c2'], { sig: 'round0', done: true, at: 9 });
    const next = prog([], { sig: 'round1', round: 1, at: 5 });
    expect(mergeProgress(before, next)).toEqual(next);
    expect(mergeProgress(next, before)).toEqual(next);
    expect(mergeProgress(prog(['c1'], { sig: 'round2', round: 2, at: 1 }), next).round).toBe(2);
  });

  it('問題が入れかわっていたら、新しく保存されたほう', () => {
    const old = prog(['c0', 'c1', 'c2'], { sig: 'old', done: true, at: 1 });
    const fresh = prog(['c2'], { sig: 'new', at: 5 });
    expect(mergeProgress(old, fresh).sig).toBe('new');
    expect(mergeProgress(fresh, old).sig).toBe('new');
  });

  it('音は、あとから変えたほう。まだえらんでいなければおぎなう', () => {
    const a = snap({ settings: { sound: null, at: 100 } });
    const b = snap({ settings: { sound: false, at: 50 } });
    const c = snap({ settings: { sound: true, at: 120 } });
    expect(mergeSnapshots(a, b).settings).toEqual({ sound: false, at: 100 });
    expect(mergeSnapshots(b, a).settings).toEqual({ sound: false, at: 100 });
    expect(mergeSnapshots(b, c).settings).toEqual({ sound: true, at: 120 });
  });
});

describe('合わせる処理の性質', () => {
  // 2 台で別々に遊んだ、少しずつちがう記録
  const a = snap({
    stamps: ['2026-10-01', '2026-10-02', '2026-10-03'],
    clears: ['stage-ancient', 'daily-2026-10-01'],
    cards: [{ id: 'c01', paid: 40 }],
    settings: { sound: true, at: 10 },
    progress: { 'stage-ancient': prog(['c0', 'c1', 'c2'], { done: true, at: 3 }), 'stage-edo': prog(['c1'], { at: 4 }) },
  });
  const b = snap({
    stamps: ['2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07'],
    clears: ['stage-ancient', 'stage-showa'],
    cards: [{ id: 'c01', paid: 40 }, { id: 'c02', paid: 80 }],
    settings: { sound: false, at: 20 },
    progress: { 'stage-edo': prog(['c1', 'c2'], { at: 2 }), 'stage-modern': prog(['c3'], { at: 5 }) },
  });
  const c = snap({ stamps: ['2026-09-30'], clears: ['stage-all'], progress: { 'stage-modern': prog(['c3', 'c3', 'c3'], { done: true, at: 1 }) } });

  it('同じものを 2 回合わせても変わらない', () => {
    const once = mergeSnapshots(a, b);
    expect(sameSnapshot(mergeSnapshots(once, b), once)).toBe(true);
    expect(sameSnapshot(mergeSnapshots(once, a), once)).toBe(true);
    expect(sameSnapshot(mergeSnapshots(a, a), a)).toBe(true);
  });

  it('入れかえても、合わせる順を変えても、同じ結果になる', () => {
    expect(sameSnapshot(mergeSnapshots(a, b), mergeSnapshots(b, a))).toBe(true);
    const x = mergeSnapshots(mergeSnapshots(a, b), c);
    const y = mergeSnapshots(a, mergeSnapshots(b, c));
    const z = mergeSnapshots(mergeSnapshots(c, a), b);
    expect(sameSnapshot(x, y)).toBe(true);
    expect(sameSnapshot(x, z)).toBe(true);
  });

  it('合わせたあとの残高は、二重にふえない', () => {
    const m = mergeSnapshots(a, b);
    // スタンプは 10/1〜10/7 の 7 日連続で 1000pt。クリアは 3 つで 60pt
    expect(earnedPoints(m.stamps).total).toBe(1000);
    expect(balance(m)).toBe(1000 + 60 - (40 + 80));
    // 何回合わせても同じ
    expect(balance(mergeSnapshots(mergeSnapshots(m, a), b))).toBe(balance(m));
  });

  it('空の記録と合わせても変わらない', () => {
    expect(sameSnapshot(mergeSnapshots(a, emptySnapshot()), a)).toBe(true);
    expect(hasRecords(emptySnapshot())).toBe(false);
    expect(hasRecords(snap({ settings: { sound: true, at: 5 } }))).toBe(false); // 設定だけ
    expect(hasRecords(snap({ progress: { x: prog([]) } }))).toBe(false); // まだ答えていない途中経過
    expect(hasRecords(snap({ progress: { x: prog(['c2']) } }))).toBe(true);
    expect(hasRecords(a)).toBe(true);
  });
});

describe('Firestore の形との変換', () => {
  const s = snap({
    stamps: ['2026-10-01'],
    clears: ['stage-ancient'],
    cards: [{ id: 'c01', paid: 40 }],
    settings: { sound: false, at: 7 },
  });

  it('学習アプリ共通の名前で保存する', () => {
    const doc = toAppDoc(s, 1234);
    expect(doc).toEqual({
      schema: 1,
      updatedAt: 1234,
      activeDays: ['2026-10-01'],
      completed: ['stage-ancient'],
      inventory: { c01: { paid: 40 } },
      spent: {},
      settings: { sound: false, at: 7 },
    });
    // 名前やメールアドレスにあたる項目はない
    expect(JSON.stringify(doc)).not.toMatch(/email|name|photo/i);
  });

  it('保存して読みもどすと、元の記録になる', () => {
    expect(sameSnapshot(fromAppDoc(toAppDoc(s, 1)), s)).toBe(true);
    const p = prog(['c0', 'c3', 'c1'], { at: 99 });
    const doc = toProgressDoc(p, 1);
    expect(doc).toMatchObject({ schema: 1, status: 'playing', updatedAt: 99 });
    expect(fromProgressDoc(doc)).toEqual(p);
    expect(toProgressDoc(prog(['c0'], { done: true }), 5)).toMatchObject({ status: 'done', updatedAt: 5 });
    // 練習の回も出し入れできる (0 回目は書かない)
    const later = prog(['c2'], { round: 3, at: 7 });
    expect(toProgressDoc(later, 1).data).toEqual({ sig: 's', placed: ['c2'], mistakes: 0, round: 3 });
    expect(fromProgressDoc(toProgressDoc(later, 1))).toEqual(later);
    expect(doc.data).not.toHaveProperty('round');
    expect(doc.data).toEqual({ sig: 's', placed: ['c0', 'c3', 'c1'], mistakes: 0 });
  });

  it('形がくずれたデータを読んでも、こわれない', () => {
    expect(sameSnapshot(fromAppDoc(null), emptySnapshot())).toBe(true);
    const broken = fromAppDoc({ activeDays: 'x', completed: [1, 'stage-ancient'], inventory: { c01: { paid: -5 }, c02: null }, settings: { sound: 'x' } } as never);
    expect(broken.stamps).toEqual([]);
    expect(broken.clears).toEqual(['stage-ancient']);
    expect(broken.cards).toEqual([]);
    expect(broken.settings.sound).toBeNull();
    expect(fromProgressDoc({ status: 'done' })).toBeNull();
    expect(fromProgressDoc({ data: { sig: 1 } } as never)).toBeNull();
  });
});
