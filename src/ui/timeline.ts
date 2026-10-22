import { STAGES } from '../data/eras';
import { EVENTS } from '../data/events';
import { personById } from '../data/people';
import { h, homeButton, withRuby } from './dom';
import { T } from './text';

/** 年表ずかん。全部のできごとを、時代ごとに年の順で見る */
export function renderTimeline(root: HTMLElement): void {
  const eras = STAGES.filter((s) => s.id !== 'all');
  const title = withRuby('h1', '', T.timelineTitle);
  root.replaceChildren(
    h(
      'div',
      { class: 'timeline-page' },
      h('header', { class: 'bar' }, homeButton(T.goHome), title, h('span', { class: 'bar-meta' }, `${EVENTS.length}こ`)),
      h(
        'main',
        { class: 'timeline-main' },
        h('p', { class: 'section-note' }, T.timelineNote),
        h(
          'nav',
          { class: 'timeline-jump', 'aria-label': '時代' },
          ...eras.map((era) => {
            const a = withRuby('a', 'btn', era.title);
            a.setAttribute('href', `#/timeline`);
            a.addEventListener('click', (e) => {
              e.preventDefault();
              document.getElementById(`era-${era.id}`)?.scrollIntoView({ behavior: 'smooth' });
            });
            return a;
          }),
        ),
        ...eras.map((era) =>
          h(
            'section',
            { class: 'timeline-era', id: `era-${era.id}` },
            withRuby('h2', 'timeline-era-title', era.title),
            h(
              'ol',
              { class: 'review timeline-list' },
              ...EVENTS.filter((e) => e.era === era.id).map((event) =>
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
            ),
          ),
        ),
        h('p', { class: 'page-foot' }, h('a', { class: 'btn btn-primary', href: '#/' }, T.goHome)),
      ),
    ),
  );
}
