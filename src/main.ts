import './styles.css';
import { restoreStore, startCloud } from './cloud';
import { jstDate } from './core/date';
import { dailyGame, stageGame, stageGameId } from './core/game';
import { saveProgress, stageRound } from './core/storage';
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
    const round = stageRound(stageGameId(stage.id));
    cleanup = renderGame(app, stageGame(stage, round), stage.title, today, () => {
      // 「つぎの 5つ」は、次の回に進む
      const next = stageGame(stage, round + 1);
      saveProgress(next.id, { sig: next.sig, placed: [], mistakes: 0, done: false, round: round + 1 });
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
