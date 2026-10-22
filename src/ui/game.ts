import { tryPlace, validPlaced, type Game, type GameCard } from '../core/game';
import { STAGE_PASS_MISTAKES, type StampReward } from '../core/rewards';
import { addClear, addStamp, balance, loadProgress, saveProgress, type Progress } from '../core/storage';
import { personById } from '../data/people';
import { h, hanamaru, homeButton, rubyHtml, withRuby } from './dom';
import { playChirp, playCorrect, playWrong, primeSound } from './sound';
import { T } from './text';

interface Reward {
  clearPoints: number;
  stamp?: StampReward;
}

/** ドラッグを始めたとみなす、指の動きの大きさ (px) */
const DRAG_START = 8;

/**
 * 年表ならべのゲーム画面。もどり値は、画面を出るときによぶ後かたづけ。
 * onRetry があれば、終わったあとに「つぎの 5つ」ボタンを出す (時代の練習)。
 */
export function renderGame(root: HTMLElement, game: Game, title: string, today: string, onRetry?: () => void): () => void {
  const saved = loadProgress(game);
  let progress: Progress = { ...saved, placed: validPlaced(game, saved.placed) };
  let selected: string | null = null;
  /** さっき置いたカード (ぽんと出る動きをつける) */
  let justPlaced: string | null = null;
  let reward: Reward | undefined;

  const cardById = new Map(game.hand.map((c) => [c.id, c]));
  const placedSet = () => new Set(progress.placed);

  const message = h('p', { class: 'game-msg', role: 'status', 'aria-live': 'polite' });
  const meta = h('span', { class: 'bar-meta' });
  const board = h('section', { class: 'board', 'aria-label': T.boardLabel });
  const hand = h('section', { class: 'hand', 'aria-labelledby': 'hand-title' });
  const result = h('div', { class: 'game-result' });

  root.replaceChildren(
    h(
      'div',
      { class: 'game-page' },
      h('header', { class: 'bar' }, homeButton(T.goHome), withRuby('h1', '', title), meta),
      h('main', { class: 'game-main' }, message, board, hand, result),
    ),
  );

  function say(text: string, tone: 'info' | 'ok' | 'ng' = 'info'): void {
    message.textContent = text;
    message.className = `game-msg is-${tone}`;
  }

  function save(): void {
    saveProgress(game.id, progress);
  }

  // ---- カードと枠の絵 ----

  function cardEl(card: GameCard, where: 'hand' | 'board'): HTMLElement {
    const el = h(
      where === 'hand' ? 'button' : 'div',
      {
        class: [
          'tcard',
          `tcard-${card.kind}`,
          where === 'board' && 'is-placed',
          card.id === selected && 'is-selected',
          card.id === justPlaced && 'is-new',
        ]
          .filter(Boolean)
          .join(' '),
        'data-card': card.id,
        ...(where === 'hand' ? { type: 'button', 'aria-pressed': String(card.id === selected) } : {}),
      },
      h('span', { class: 'tcard-tag' }, card.kind === 'event' ? T.eventTag : T.personTag),
    );
    const label = h('span', { class: 'tcard-label' });
    label.innerHTML = rubyHtml(card.label);
    el.append(label);
    return el;
  }

  /** できごとの列の上に、年を出す (ならべ終わったとき) */
  function yearBadge(column: number): HTMLElement {
    return h('span', { class: 'tcard-year', style: `--i:${column}` }, game.events[column].when);
  }

  function renderBoard(): void {
    const placed = placedSet();
    const target = selected ? cardById.get(selected) : undefined;
    const columns = game.events.map((event, col) => {
      const eventId = `e:${event.id}`;
      const eventCard = cardById.get(eventId)!;
      const eventPlaced = placed.has(eventId);
      const top = eventPlaced
        ? h('div', { class: 'slot-filled' }, progress.done ? yearBadge(col) : null, cardEl(eventCard, 'board'))
        : h(
            'button',
            {
              type: 'button',
              class: `slot slot-event${target?.kind === 'event' ? ' is-target' : ''}`,
              'data-col': col,
              'data-kind': 'event',
              'aria-label': T.slotEventLabel(col + 1),
            },
            h('span', { class: 'slot-num', 'aria-hidden': 'true' }, String(col + 1)),
            h('span', { class: 'slot-hint', 'aria-hidden': 'true' }, T.eventTag),
          );
      // この列に置いた人物 (置いた順)。のこりは空の枠
      const people = progress.placed.map((id) => cardById.get(id)!).filter((c) => c.kind === 'person' && c.column === col);
      const empty = game.people[col].length - people.length;
      const personTarget = target?.kind === 'person' && eventPlaced;
      const plain = event.title.replace(/\(([ぁ-ん]+)\)/g, '');
      return h(
        'div',
        { class: 'column', role: 'group', 'aria-label': T.slotEvent(col + 1) },
        top,
        h(
          'div',
          { class: 'column-people' },
          ...people.map((c) => cardEl(c, 'board')),
          ...Array.from({ length: empty }, () =>
            h(
              'button',
              {
                type: 'button',
                class: `slot slot-person${personTarget ? ' is-target' : ''}${eventPlaced ? '' : ' is-locked'}`,
                'data-col': col,
                'data-kind': 'person',
                'aria-label': eventPlaced ? T.slotPersonLabel(plain) : T.needEvent,
              },
              h('span', { class: 'slot-hint', 'aria-hidden': 'true' }, T.slotPerson),
            ),
          ),
        ),
      );
    });
    board.replaceChildren(
      h('div', { class: 'board-axis', 'aria-hidden': 'true' }, h('span', {}, T.past), h('span', { class: 'board-arrow' }), h('span', {}, T.now)),
      h('div', { class: 'columns', style: `--cols:${game.events.length}` }, ...columns),
    );
  }

  function renderHand(): void {
    const placed = placedSet();
    const left = game.hand.filter((c) => !placed.has(c.id));
    hand.replaceChildren(
      h('div', { class: 'hand-head' }, h('h2', { id: 'hand-title' }, T.handTitle), h('p', { class: 'hand-note' }, left.length ? T.handNote : T.handEmpty)),
      // できごとと人物は、別々の列にならべる
      ...(left.length
        ? [
            h(
            'div',
            { class: 'hand-groups' },
            ...(['event', 'person'] as const).map((kind) =>
              h(
                'div',
                { class: `hand-group hand-group-${kind}` },
                h('h3', { class: 'hand-group-title' }, kind === 'event' ? T.eventTag : T.personTag),
                  h('div', { class: 'hand-cards' }, ...left.filter((c) => c.kind === kind).map((c) => cardEl(c, 'hand'))),
                ),
              ),
            ),
          ]
        : []),
    );
  }

  function renderMeta(): void {
    meta.textContent = `${T.mistakes(progress.mistakes)}・${T.placedCount(progress.placed.length, game.hand.length)}`;
  }

  function render(): void {
    renderBoard();
    renderHand();
    renderMeta();
    justPlaced = null;
  }

  // ---- 操作 ----

  function select(id: string | null): void {
    selected = selected === id ? null : id;
    if (selected) {
      primeSound();
      const card = cardById.get(selected)!;
      const hasEvent = game.events.some((e) => placedSet().has(`e:${e.id}`));
      say(card.kind === 'person' && !hasEvent ? T.needEvent : T.pickHint);
    } else {
      say('');
    }
    renderBoard();
    renderHand();
  }

  /** カードを column の列に置こうとする */
  function place(cardId: string, column: number): void {
    if (progress.done) return;
    const card = cardById.get(cardId);
    if (!card) return;
    const outcome = tryPlace(game, placedSet(), cardId, column);
    if (outcome === 'invalid') {
      say(card.kind === 'person' ? T.needEvent : T.pickHint);
      return;
    }
    if (outcome === 'ok') {
      playCorrect();
      progress = { ...progress, placed: [...progress.placed, cardId] };
      selected = null;
      justPlaced = cardId;
      say(T.correct, 'ok');
      if (progress.placed.length === game.hand.length) {
        finish();
        return;
      }
      save();
      render();
      return;
    }
    if (outcome === 'wrong') {
      playWrong();
      progress = { ...progress, mistakes: progress.mistakes + 1 };
      save();
      say(card.kind === 'event' ? T.wrongEvent : T.wrongPerson, 'ng');
    } else {
      say(T.elsewhere, 'info');
    }
    // カードはゆれて手札にもどる
    selected = null;
    render();
    const back = hand.querySelector<HTMLElement>(`[data-card="${CSS.escape(cardId)}"]`);
    back?.classList.add('is-shake');
    const slot = board.querySelector<HTMLElement>(`.slot[data-col="${column}"][data-kind="${card.kind}"]`);
    slot?.classList.add('is-ng');
  }

  function finish(): void {
    progress = { ...progress, done: true };
    save();
    reward = { clearPoints: 0 };
    if (game.kind === 'daily') {
      reward.clearPoints = addClear(game.id);
      reward.stamp = addStamp(today);
    } else if (progress.mistakes <= STAGE_PASS_MISTAKES) {
      reward.clearPoints = addClear(game.id);
    }
    playChirp(reward.clearPoints > 0 || reward.stamp?.added ? 3 : 1);
    say('');
    render();
    showResult();
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showResult(): void {
    const passed = game.kind === 'daily' || progress.mistakes <= STAGE_PASS_MISTAKES;
    const stamp = reward?.stamp?.added ? reward.stamp : undefined;
    const rewardBox =
      reward && (reward.clearPoints > 0 || stamp)
        ? h(
            'div',
            { class: 'result-rewards' },
            stamp ? h('p', { class: 'result-reward' }, T.stampDone) : null,
            reward.clearPoints > 0 ? h('p', { class: 'result-reward' }, T.rewardClear(reward.clearPoints)) : null,
            stamp && stamp.weekPoints > 0 ? h('p', { class: 'result-reward' }, T.rewardWeek(stamp.run)) : null,
            stamp && stamp.monthPoints > 0 ? h('p', { class: 'result-reward' }, T.rewardMonth(Number(today.slice(5, 7)))) : null,
            h('p', { class: 'points' }, h('span', { class: 'points-label' }, T.pointsLabel), h('b', { class: 'points-num' }, T.points(balance()))),
          )
        : null;

    const review = h(
      'ol',
      { class: 'review' },
      ...game.events.map((event) =>
        h(
          'li',
          { class: 'review-item' },
          h('p', { class: 'review-year' }, event.when),
          withRuby('h3', 'review-title', event.title),
          event.people.length
            ? withRuby('p', 'review-people', event.people.map((id) => personById(id)?.name ?? id).join('・'))
            : null,
          withRuby('p', 'review-note', event.note),
        ),
      ),
    );

    result.replaceChildren(
      h(
        'section',
        { class: 'result', 'aria-labelledby': 'result-title' },
        h(
          'div',
          { class: 'result-head' },
          h(
            'div',
            {},
            h('h2', { id: 'result-title' }, T.resultTitle),
            h('p', { class: 'result-score' }, T.resultMistakes(progress.mistakes)),
            h('p', { class: 'result-note' }, game.kind === 'daily' ? T.resultDaily : passed ? T.resultPass : T.resultTry),
          ),
          passed && progress.mistakes === 0 ? hanamaru() : null,
        ),
        rewardBox,
        h(
          'div',
          { class: 'result-actions' },
          onRetry ? h('button', { type: 'button', class: 'btn btn-primary', onclick: () => onRetry() }, T.retry) : null,
          game.kind === 'daily' ? h('a', { class: 'btn btn-primary', href: '#/stamps' }, T.seeStamps) : null,
          h('a', { class: 'btn', href: '#/' }, T.goHome),
        ),
        h('h2', { class: 'review-heading' }, T.reviewTitle),
        review,
      ),
    );
  }

  // タップ (クリック) とキーボード: カードをえらんで、置く場所をえらぶ
  function onClick(e: MouseEvent): void {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    const target = e.target as HTMLElement;
    const cardBtn = target.closest<HTMLElement>('.hand [data-card]');
    if (cardBtn) {
      select(cardBtn.dataset.card!);
      return;
    }
    const slot = target.closest<HTMLElement>('.slot[data-col]');
    if (slot) {
      if (!selected) {
        say(T.handNote);
        return;
      }
      const card = cardById.get(selected)!;
      if (slot.dataset.kind !== card.kind) {
        say(card.kind === 'event' ? T.pickHint : T.needEvent);
        return;
      }
      place(selected, Number(slot.dataset.col));
    }
  }

  // ドラッグ: 手札のカードを指 (マウス) で年表の枠まで運ぶ
  let drag: { id: string; startX: number; startY: number; ghost: HTMLElement | null; source: HTMLElement } | null = null;
  let suppressClick = false;

  function onPointerDown(e: PointerEvent): void {
    if (progress.done || e.button !== 0) return;
    const source = (e.target as HTMLElement).closest<HTMLElement>('.hand [data-card]');
    if (!source) return;
    drag = { id: source.dataset.card!, startX: e.clientX, startY: e.clientY, ghost: null, source };
  }

  function onPointerMove(e: PointerEvent): void {
    if (!drag) return;
    if (!drag.ghost) {
      if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) < DRAG_START) return;
      // ドラッグを始める。えらんだ状態にして、置ける場所を光らせる
      selected = null;
      select(drag.id);
      const source = hand.querySelector<HTMLElement>(`[data-card="${CSS.escape(drag.id)}"]`) ?? drag.source;
      const rect = source.getBoundingClientRect();
      const ghost = source.cloneNode(true) as HTMLElement;
      ghost.classList.add('tcard-ghost');
      ghost.style.width = `${rect.width}px`;
      document.body.append(ghost);
      source.classList.add('is-dragging');
      drag.ghost = ghost;
    }
    e.preventDefault();
    drag.ghost.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) rotate(-3deg)`;
    for (const el of board.querySelectorAll('.slot.is-over')) el.classList.remove('is-over');
    slotAt(e.clientX, e.clientY)?.classList.add('is-over');
  }

  function slotAt(x: number, y: number): HTMLElement | null {
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    // 人物は、列のどこに落としても (できごとのカードの上でも) その列に置く
    const slot = el?.closest<HTMLElement>('.slot[data-col]');
    if (slot) return slot;
    const column = el?.closest<HTMLElement>('.column');
    if (!column || !drag) return null;
    const kind = cardById.get(drag.id)?.kind;
    return column.querySelector<HTMLElement>(`.slot[data-kind="${kind}"]`);
  }

  function onPointerUp(e: PointerEvent): void {
    if (!drag) return;
    const { id, ghost } = drag;
    drag = null;
    if (!ghost) return; // 動かしていない: ふつうのタップとしてあつかう
    ghost.remove();
    suppressClick = true;
    setTimeout(() => (suppressClick = false), 0);
    const slot = slotAt(e.clientX, e.clientY);
    const card = cardById.get(id)!;
    if (slot && slot.dataset.kind === card.kind) {
      place(id, Number(slot.dataset.col));
    } else {
      selected = null;
      say('');
      render();
    }
  }

  function onPointerCancel(): void {
    drag?.ghost?.remove();
    drag = null;
    render();
  }

  function onKey(e: KeyboardEvent): void {
    if (e.key === 'Escape' && selected) select(null);
  }

  const main = root.querySelector('.game-main') as HTMLElement;
  main.addEventListener('click', onClick);
  main.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: false });
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerCancel);
  window.addEventListener('keydown', onKey);

  render();
  if (progress.done) showResult();

  return () => {
    drag?.ghost?.remove();
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerCancel);
    window.removeEventListener('keydown', onKey);
  };
}
