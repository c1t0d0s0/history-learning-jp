import { jstDate } from '../core/date';
import { dailyGame, stageGame, stageGameId } from '../core/game';
import { currentRun } from '../core/rewards';
import { balance, getSound, getStamps, pruneOldDaily, setSound, stageRound, statusOf } from '../core/storage';
import { STAGES, type Stage } from '../data/eras';
import { accountBox } from './account';
import { h, hanamaru, withRuby } from './dom';
import { sparrow } from './sparrow';
import { T } from './text';

/** 右の列を出す画面のはば (styles.css の .home と同じ値) */
const WIDE = '(min-width: 64rem)';

/** 効果音を鳴らすかどうかの切りかえ */
function soundSwitch(): HTMLElement {
  const btn = h('button', { type: 'button', class: 'btn sound-switch' });
  const paint = () => {
    const on = getSound();
    btn.textContent = on ? T.soundOn : T.soundOff;
    btn.setAttribute('aria-pressed', String(on));
  };
  btn.addEventListener('click', () => {
    setSound(!getSound());
    paint();
  });
  paint();
  return h('p', { class: 'settings' }, btn);
}

function stageTile(stage: Stage, index: number): HTMLElement {
  const status = statusOf(stageGame(stage, stageRound(stageGameId(stage.id))));
  return h(
    'a',
    { class: `unit unit-${status}`, href: `#/stage/${stage.id}` },
    h('span', { class: 'unit-num', 'aria-hidden': 'true' }, String(index + 1)),
    withRuby('span', 'unit-title', stage.title),
    status === 'new'
      ? withRuby('span', 'unit-meta', stage.sub)
      : h('span', { class: 'unit-meta unit-status' }, status === 'done' ? T.cleared : T.playing),
    status === 'done' ? hanamaru('hanamaru hanamaru-small') : null,
  );
}

export function renderHome(root: HTMLElement): void {
  const today = jstDate();
  pruneOldDaily(today);
  const daily = dailyGame(today);
  const dailyStatus = statusOf(daily);
  const run = currentRun(getStamps(), today);
  const dailyAction = { new: T.start, playing: T.resume, done: T.review }[dailyStatus];
  const d = new Date(`${today}T00:00:00Z`);
  const timelineLink = withRuby('a', 'btn', T.seeTimeline);
  timelineLink.setAttribute('href', '#/timeline');
  const timelineTitle = withRuby('h2', '', T.timelineTitle);
  timelineTitle.id = 'timeline-title';

  root.replaceChildren(
    h(
      'main',
      { class: 'home' },
      h(
        'div',
        { class: 'home-main' },
        h(
          'header',
          { class: 'hero' },
          sparrow(),
          h('div', { class: 'hero-text' }, h('h1', { class: 'brand' }, T.brand), h('p', { class: 'lead' }, T.lead)),
        ),
        h(
          'section',
          { class: 'daily', 'aria-labelledby': 'daily-title' },
          h(
            'div',
            { class: 'daily-text' },
            h('h2', { id: 'daily-title' }, T.daily),
            h('p', { class: 'daily-date' }, T.dateLabel(d.getUTCMonth() + 1, d.getUTCDate(), d.getUTCDay())),
            h('p', { class: 'daily-note' }, T.dailyNote(dailyStatus === 'done', run)),
          ),
          dailyStatus === 'done' ? hanamaru('hanamaru hanamaru-daily') : null,
          h('a', { class: 'btn btn-primary', href: '#/daily' }, dailyAction),
        ),
        // スタンプカードとスズメカードは、それぞれのページで見る
        h(
          'nav',
          { class: 'reward-links', 'aria-label': T.rewardLinks },
          h('p', { class: 'points' }, h('span', { class: 'points-label' }, T.pointsLabel), h('b', { class: 'points-num' }, T.points(balance()))),
          h(
            'div',
            { class: 'reward-buttons' },
            h('a', { class: 'btn', href: '#/stamps' }, T.stampTitle),
            h('a', { class: 'btn', href: '#/cards' }, T.cardsTitle),
          ),
        ),
        h(
          'section',
          { 'aria-labelledby': 'stages-title' },
          h('h2', { id: 'stages-title' }, T.stagesTitle),
          h('p', { class: 'section-note' }, T.stagesNote),
          h('div', { class: 'units' }, ...STAGES.map((s, i) => stageTile(s, i))),
        ),
        h(
          'section',
          { 'aria-labelledby': 'timeline-title' },
          timelineTitle,
          h('p', { class: 'section-note' }, T.timelineNote),
          h('div', { class: 'zukan-links' }, timelineLink),
        ),
      ),
      // 記録の保存・あそびかた・音。広い画面では右の列にならべ、スクロールしなくても見えるようにする
      h(
        'aside',
        { class: 'home-side' },
        accountBox(T),
        h(
          'details',
          // 広い画面では場所があるので、はじめから開いておく
          { class: 'howto', open: matchMedia(WIDE).matches },
          h('summary', {}, T.howto),
          h('ul', {}, ...T.howtoItems.map((item) => h('li', {}, item))),
        ),
        soundSwitch(),
      ),
    ),
  );
}
