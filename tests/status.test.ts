import { beforeEach, describe, expect, it } from 'vitest';
import { finishedBefore, saveProgress, statusOf } from '../src/core/storage';

const store = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    key: (i: number) => [...store.keys()][i] ?? null,
    get length() {
      return store.size;
    },
  },
});
beforeEach(() => store.clear());

const game = { id: 'stage-edo', sig: 's0' };

describe('ホームの「クリア」と花丸は、クリアした日だけ', () => {
  it('クリアした日は「クリア」、次の日は「はじめ」にもどる', () => {
    saveProgress(game.id, { sig: 's0', placed: ['e:a'], mistakes: 0, done: true, clearedOn: '2026-11-10' });
    expect(statusOf(game, '2026-11-10')).toBe('done');
    expect(statusOf(game, '2026-11-11')).toBe('new');
  });

  it('今日のうちに次の回に進んでも、「クリア」のまま', () => {
    saveProgress(game.id, { sig: 's1', placed: [], mistakes: 0, done: false, round: 1, clearedOn: '2026-11-10' });
    expect(statusOf({ id: game.id, sig: 's1' }, '2026-11-10')).toBe('done');
    expect(statusOf({ id: game.id, sig: 's1' }, '2026-11-11')).toBe('new');
  });

  it('ミスが多くてクリアにならなかったときは「はじめ」、途中なら「とちゅう」', () => {
    saveProgress(game.id, { sig: 's0', placed: ['e:a'], mistakes: 5, done: true });
    expect(statusOf(game, '2026-11-10')).toBe('new');
    saveProgress(game.id, { sig: 's0', placed: ['e:a'], mistakes: 0, done: false });
    expect(statusOf(game, '2026-11-10')).toBe('playing');
  });

  it('ならべ終わったのが今日より前かどうか', () => {
    const at = Date.UTC(2026, 10, 9, 3); // 日本時間 11/9 12:00
    expect(finishedBefore({ sig: 's', placed: [], mistakes: 0, done: true, at }, '2026-11-10')).toBe(true);
    expect(finishedBefore({ sig: 's', placed: [], mistakes: 0, done: true, at }, '2026-11-09')).toBe(false);
    expect(finishedBefore({ sig: 's', placed: [], mistakes: 0, done: false, at }, '2026-11-10')).toBe(false);
  });
});
