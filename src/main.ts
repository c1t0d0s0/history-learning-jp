import './styles.css';
import { restoreStore, startCloud } from './cloud';
import { jstDate } from './core/date';
import { dailyGame, stageGame, stageGameId } from './core/game';
import { finishedBefore, saveProgress, savedProgress, stageRound } from './core/storage';
import { stageById } from './data/eras';
import { renderCards } from './ui/cards';
import { renderGame } from './ui/game';
import { renderHome } from './ui/home';
import { renderStamps } from './ui/stamps';
import { T } from './ui/text';
import { renderTimeline } from './ui/timeline';

// 前にログインしていた人がいれば、通信を待たずに、この端末に残っているその人の写しで画面を出す
restoreStore();

const app = document.getElementById('app')!;
let cleanup: (() => void) | null = null;

function route(): void {
  cleanup?.();
  cleanup = null;

  // #/daily は今日のチャレンジ、#/stage/edo は時代の練習、#/timeline は年表ずかん
  const today = jstDate();
  const stage = stageById(location.hash.match(/^#\/stage\/([a-z]+)$/)?.[1] ?? '');
  if (location.hash === '#/daily') {
    cleanup = renderGame(app, dailyGame(today), T.daily, today);
  } else if (stage) {
    const id = stageGameId(stage.id);
    // 「つぎの 5つ」は、次の回に進む。今日クリアしたことは引きつぐ
    const nextRound = () => {
      const round = stageRound(id);
      const next = stageGame(stage, round + 1);
      const clearedOn = savedProgress(id)?.clearedOn;
      saveProgress(next.id, { sig: next.sig, placed: [], mistakes: 0, done: false, round: round + 1, ...(clearedOn ? { clearedOn } : {}) });
    };
    // 前の日にならべ終わった回は、開いたときに次の回に進める (ホームでは「はじめ」にもどっているので)
    const saved = savedProgress(id);
    if (saved && finishedBefore(saved, today)) nextRound();
    cleanup = renderGame(app, stageGame(stage, stageRound(id)), stage.title, today, () => {
      nextRound();
      route();
    });
  } else if (location.hash === '#/timeline') {
    renderTimeline(app);
  } else if (location.hash === '#/cards') {
    renderCards(app);
  } else if (location.hash === '#/stamps') {
    renderStamps(app);
  } else {
    renderHome(app);
  }
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();

// 最初の画面を出してから、ログインと Firestore の準備をする (Firebase の設定がないビルドでは何もしない)
void startCloud({
  // ログインやほぞんの状態が変わった。状態を出しているのはタイトル画面だけ
  onStatus: () => {
    if (app.querySelector('.home')) renderHome(app);
  },
  // Firestore から取りこんで、手元の記録が変わった。今の画面をかき直す
  onData: route,
  askMigrate: () => confirm(T.askMigrate),
});
