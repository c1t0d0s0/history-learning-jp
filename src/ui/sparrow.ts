import type { Background, Card, Item, Look } from '../data/cards';
import { h } from './dom';

// 目や輪郭は、画面の明暗に関係なくこの色にする (文字色に合わせると暗い画面で白目になる)
const LINE = '#1c2a4a';
const RED = '#d63c2c';
const SUMI = '#2b2b33';
const WOOD = '#8a5a2b';
const YELLOW = '#ffd23f';
const BEAK = '#5a4636';

const sparkle = (cx: number, cy: number, r: number, fill = YELLOW) =>
  `<path fill="${fill}" d="M${cx} ${cy - r}Q${cx} ${cy} ${cx + r} ${cy}Q${cx} ${cy} ${cx} ${cy + r}Q${cx} ${cy} ${cx - r} ${cy}Q${cx} ${cy} ${cx} ${cy - r}Z"/>`;

const EYE_Y = 69;
const EYE_X = [42, 78];

function eyes(look: Look): string {
  const open = (x: number) =>
    look.eyeColor
      ? `<ellipse cx="${x}" cy="${EYE_Y}" rx="7.5" ry="8.5" fill="${look.eyeColor}" stroke="${LINE}" stroke-width="1.6"/>` +
        `<ellipse cx="${x}" cy="${EYE_Y}" rx="3.3" ry="6.4" fill="${LINE}"/>` +
        `<circle cx="${x + 2.6}" cy="${EYE_Y - 3.6}" r="2" fill="#fff"/>`
      : `<ellipse cx="${x}" cy="${EYE_Y}" rx="7.5" ry="8.5" fill="${LINE}"/>` +
        `<circle cx="${x + 2.6}" cy="${EYE_Y - 3.6}" r="3.1" fill="#fff"/>` +
        `<circle cx="${x - 2.6}" cy="${EYE_Y + 3.6}" r="1.5" fill="#fff"/>`;
  const arc = (x: number, up: boolean) =>
    `<path fill="none" stroke="${LINE}" stroke-width="2.8" stroke-linecap="round" d="M${x - 7} ${EYE_Y + (up ? 2 : -1)}Q${x} ${EYE_Y + (up ? -8 : 7)} ${x + 7} ${EYE_Y + (up ? 2 : -1)}"/>`;
  const [l, r] = EYE_X;
  switch (look.eyes ?? 'open') {
    case 'wink':
      return open(l) + arc(r, true);
    case 'sleep':
      return arc(l, false) + arc(r, false);
    case 'happy':
      return arc(l, true) + arc(r, true);
    case 'sparkle':
      return open(l) + open(r) + sparkle(l - 11, EYE_Y - 12, 4.5) + sparkle(r + 11, EYE_Y - 12, 4.5);
    case 'hole':
      return EYE_X.map((x) => `<ellipse cx="${x}" cy="${EYE_Y}" rx="6.5" ry="4.6" fill="#5a3a22"/>`).join('');
    case 'brave':
      return (
        open(l) +
        open(r) +
        `<path fill="none" stroke="${LINE}" stroke-width="3" stroke-linecap="round" d="M33 56L50 60.5M87 56L70 60.5"/>`
      );
    default:
      return open(l) + open(r);
  }
}

/** くちばしと、のどの黒いもよう */
function beak(look: Look): string {
  const bib = `<path fill="${LINE}" d="M53 91Q60 94 67 91Q67.5 99 60 101Q52.5 99 53 91Z"/>`;
  if (look.mouth === 'open') {
    return (
      bib +
      `<g stroke="${LINE}" stroke-width="2" stroke-linejoin="round">` +
      `<path fill="#8a3b3b" d="M55 80L60 90L65 80Z"/>` +
      `<path fill="${BEAK}" d="M54 79.5Q60 75.5 66 79.5Q60 83 54 79.5Z"/>` +
      `<path fill="${BEAK}" d="M57 87Q60 86 63 87L60 91.5Z"/></g>`
    );
  }
  return (
    bib +
    `<path fill="${BEAK}" stroke="${LINE}" stroke-width="2" stroke-linejoin="round" d="M54 79.5Q60 75.5 66 79.5L60 88.5Z"/>` +
    `<path fill="none" stroke="${LINE}" stroke-width="1.4" stroke-linecap="round" d="M56 81.5Q60 83.5 64 81.5"/>`
  );
}

// 頭の上にかぶるもの。これがあるときは、頭のてっぺんの羽をかかない
const HEADWEAR: Item[] = ['eboshi', 'kanmuri', 'chonmage', 'kasa', 'kabuto', 'headband', 'gakubou'];

const bead = (x: number, y: number, a: number) =>
  `<g transform="translate(${x} ${y}) rotate(${a})"><path fill="#3fae84" stroke="${LINE}" stroke-width="1.4" d="M2 -5A5 5 0 1 1 -3 3Q-5 6 -3 10Q-9 6 -6 0Q-4 -5 2 -5Z"/>` +
  `<circle cx="1" cy="0" r="1.4" fill="#fff"/></g>`;

const ITEMS: Record<Item, string> = {
  // 古墳から出てくる勾玉(まがたま)の首かざり
  magatama:
    `<path fill="none" stroke="${LINE}" stroke-width="1.6" d="M30 90Q60 112 90 90"/>` + bead(44, 100, -20) + bead(60, 105, 0) + bead(76, 100, 20),
  // 平安の貴族の烏帽子(えぼし)
  eboshi:
    `<path fill="${SUMI}" stroke="${LINE}" stroke-width="2.5" stroke-linejoin="round" d="M40 34Q38 8 54 -4Q68 -12 75 -3Q81 10 80 34Q60 40 40 34Z"/>` +
    `<path fill="none" stroke="#fff" stroke-width="1.4" opacity="0.35" d="M48 28Q48 10 58 0"/>`,
  // 冠(かんむり)と、うしろに立つ纓(えい)
  kanmuri:
    `<g fill="${SUMI}" stroke="${LINE}" stroke-width="2.2" stroke-linejoin="round">` +
    `<path d="M64 10Q84 -6 96 -22L101 -17Q90 0 68 16Z"/>` +
    `<path d="M54 18Q54 4 60 4Q66 4 66 18Z"/>` +
    `<path d="M42 34Q42 16 60 15Q78 16 78 34Q60 38 42 34Z"/></g>`,
  // 十二単(じゅうにひとえ)のかさなったえり
  junihitoe: ['#7a3fa0', '#3fa37a', '#f2c14e', '#d63c2c']
    .map((c, i) => `<path fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" d="M24 ${90 + i * 4.5}Q60 ${110 + i * 4.5} 96 ${90 + i * 4.5}"/>`)
    .join(''),
  makimono:
    `<g stroke="${LINE}" stroke-width="2" stroke-linejoin="round">` +
    `<rect x="30" y="98" width="60" height="18" fill="#fffaf0"/>` +
    `<rect x="24" y="95" width="8" height="24" rx="3" fill="${WOOD}"/><rect x="88" y="95" width="8" height="24" rx="3" fill="${WOOD}"/></g>` +
    `<path fill="none" stroke="#9aa6b8" stroke-width="1.4" stroke-linecap="round" d="M38 103H82M38 108H74M38 113H80"/>`,
  fude:
    `<g transform="rotate(30 97 34)" stroke="${LINE}" stroke-width="2" stroke-linejoin="round">` +
    `<rect x="94" y="6" width="6" height="36" fill="${WOOD}"/><path fill="${SUMI}" d="M93.5 42H100.5Q102 51 97 58Q92 51 93.5 42Z"/></g>`,
  // ちょんまげ (頭の上にのせた まげ)
  chonmage:
    `<path fill="${SUMI}" stroke="${LINE}" stroke-width="2" stroke-linejoin="round" d="M50 31Q48 22 57 22L76 17Q85 16 83 23Q81 28 72 27L63 30Z"/>` +
    `<path fill="none" stroke="#fff" stroke-width="1.6" d="M62 21.5L64 28"/>`,
  // 旅人の笠(かさ)
  kasa:
    `<path fill="#e3c27a" stroke="${LINE}" stroke-width="2.5" stroke-linejoin="round" d="M6 40L60 2L114 40Q60 49 6 40Z"/>` +
    `<path fill="none" stroke="#b8964f" stroke-width="1.4" d="M60 3L34 43M60 3L86 43M60 3V46M60 3L16 40M60 3L104 40"/>`,
  // 日の丸の扇(おうぎ)
  sensu:
    `<g transform="translate(101 80) rotate(-18)">` +
    `<path fill="#fff" stroke="${LINE}" stroke-width="2" stroke-linejoin="round" d="M0 2L-18 -26A32 32 0 0 1 18 -26Z"/>` +
    `<circle cx="0" cy="-19" r="5" fill="${RED}"/>` +
    `<path fill="none" stroke="#c9c2b0" stroke-width="1" d="M0 2L-9 -29M0 2V-30M0 2L9 -29"/></g>`,
  katana:
    `<g transform="rotate(-14 60 104)" stroke="${LINE}" stroke-width="1.8" stroke-linejoin="round">` +
    `<rect x="4" y="101" width="60" height="7" rx="3" fill="${SUMI}"/>` +
    `<rect x="64" y="99" width="5" height="11" rx="1.5" fill="${YELLOW}"/>` +
    `<rect x="69" y="101" width="20" height="7" rx="2" fill="#f3efe2"/></g>` +
    `<path fill="none" stroke="${RED}" stroke-width="1.4" transform="rotate(-14 60 104)" d="M72 101L76 108M78 101L82 108M84 101L88 108"/>`,
  // 兜(かぶと)と金の鍬形(くわがた)
  kabuto:
    `<g stroke="${LINE}" stroke-width="2.5" stroke-linejoin="round">` +
    `<path fill="${YELLOW}" d="M55 22Q38 6 30 -18Q46 -4 60 10Q74 -4 90 -18Q82 6 65 22Z"/>` +
    `<path fill="#34477a" d="M22 46Q22 14 60 12Q98 14 98 46Q60 36 22 46Z"/>` +
    `<path fill="#26365f" d="M18 46Q60 32 102 46L108 58Q60 44 12 58Z"/></g>` +
    `<circle cx="60" cy="24" r="5" fill="${RED}" stroke="${LINE}" stroke-width="1.6"/>`,
  // 戦国大名の軍配(ぐんばい)
  gunbai:
    `<g transform="translate(103 88) rotate(14)" stroke="${LINE}" stroke-width="1.8" stroke-linejoin="round">` +
    `<rect x="-2.5" y="-6" width="5" height="26" fill="${WOOD}"/>` +
    `<path fill="${SUMI}" d="M0 -6C-17 -8 -17 -36 0 -40C17 -36 17 -8 0 -6Z"/>` +
    `<circle cx="0" cy="-23" r="6.5" fill="${RED}"/></g>`,
  headband:
    `<g stroke="${LINE}" stroke-width="2.2" stroke-linejoin="round" fill="#fff">` +
    `<path d="M97 52L112 44L110 53L114 60L98 58Z"/><path d="M21 50Q60 33 99 50L99.5 59Q60 42 20.5 59Z"/></g>` +
    `<circle cx="60" cy="44.5" r="4.4" fill="${RED}"/>`,
  // 明治の学生帽(がくせいぼう)
  gakubou:
    `<g stroke="${LINE}" stroke-width="2.5" stroke-linejoin="round" fill="#22252e">` +
    `<path d="M33 35Q33 11 60 11Q87 11 87 35Q60 30 33 35Z"/>` +
    `<path d="M38 34Q60 39 88 32Q86 43 62 45Q42 43 38 34Z"/></g>` +
    `<path fill="none" stroke="#fff" stroke-width="1.6" opacity="0.6" d="M35 30Q60 26 85 30"/>` +
    `<circle cx="60" cy="21" r="3.6" fill="${YELLOW}" stroke="${LINE}" stroke-width="1.2"/>`,
  book:
    `<g stroke="${LINE}" stroke-width="2.2" stroke-linejoin="round">` +
    `<path fill="#fff" d="M32 100Q46 93 60 100Q74 93 88 100V120Q74 113 60 120Q46 113 32 120Z"/>` +
    `<path fill="none" d="M60 100V120"/></g>` +
    `<path fill="none" stroke="#9aa6b8" stroke-width="1.4" stroke-linecap="round" d="M38 104Q46 101 54 104M38 109Q46 106 54 109M66 104Q74 101 82 104M66 109Q74 106 82 109"/>`,
  glasses:
    `<g fill="rgba(255,255,255,0.3)" stroke="${LINE}" stroke-width="2.6">` +
    `<circle cx="42" cy="69" r="11.5"/><circle cx="78" cy="69" r="11.5"/>` +
    `<path fill="none" stroke-linecap="round" d="M53.5 67.5Q60 63.5 66.5 67.5M30.5 67L21 63M89.5 67L99 63"/></g>`,
  bowtie:
    `<g transform="translate(60 93)" stroke="${LINE}" stroke-width="2" stroke-linejoin="round" fill="${RED}">` +
    `<path d="M0 0L-13 -7V7Z"/><path d="M0 0L13 -7V7Z"/><circle r="3.6"/></g>`,
};

const FUR = '#b9763f';
const LIGHT = '#fbf3e2';
const WING = '#8c5a33';

/**
 * スズメ (たて 110 × よこ 120 の中にかく)。茶色い頭、白いほおの黒いもよう、のどの黒いもようが目じるし。
 * 目の位置や頭の大きさは小物 (ぼうし・めがねなど) に合わせてあるので、変えるときは ITEMS も見直すこと。
 */
export function sparrowBody(look: Look = {}): string {
  const items = look.items ?? [];
  const fur = look.fur ?? FUR;
  const light = look.light ?? LIGHT;
  const wing = look.wing ?? WING;
  const tuft = !items.some((i) => HEADWEAR.includes(i));
  return (
    `<path fill="none" stroke="#e8963a" stroke-width="3" stroke-linecap="round" d="M48 103V109M43 109H53M72 103V109M67 109H77"/>` +
    `<g stroke="${LINE}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">` +
    `<path fill="${wing}" d="M22 62C8 72 6 92 17 103C25 97 29 82 27 66ZM98 62C112 72 114 92 103 103C95 97 91 82 93 66Z"/>` +
    (tuft ? `<path fill="${fur}" d="M54 30C53 22 56 17 59 21C60 15 65 15 65 21C68 18 71 22 68 30Z"/>` : '') +
    `<path fill="${fur}" d="M60 27C36 27 19 45 19 68C19 91 36 106 60 106C84 106 101 91 101 68C101 45 84 27 60 27Z"/></g>` +
    `<path fill="${light}" d="M60 58C50 51 34 53 25 64C21 85 37 103 60 103C83 103 99 85 95 64C86 53 70 51 60 58Z"/>` +
    `<path fill="none" stroke="${wing}" stroke-width="2" stroke-linecap="round" opacity="0.55" d="M46 39Q60 34 74 39M40 47Q60 40 80 47"/>` +
    `<ellipse cx="30" cy="83" rx="6.5" ry="5" fill="${LINE}"/><ellipse cx="90" cy="83" rx="6.5" ry="5" fill="${LINE}"/>` +
    eyes(look) +
    beak(look) +
    items.map((item) => ITEMS[item]).join('')
  );
}

/** タイトル画面のスズメ */
export function sparrow(): HTMLElement {
  const el = h('div', { class: 'sparrow' });
  el.innerHTML = `<svg viewBox="0 0 120 112" role="img" aria-label="スズメのキャラクター">${sparrowBody()}</svg>`;
  return el;
}

// ---- カードの絵柄 (たて 156 × よこ 120) ----

const W = 120;
const H = 156;
const circles = (points: number[][], fill: string) =>
  points.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join('');
const fillRect = (fill: string) => `<rect width="${W}" height="${H}" fill="${fill}"/>`;

function background(bg: Background): string {
  switch (bg) {
    case 'night':
      return (
        fillRect('#27305a') +
        `<circle cx="24" cy="24" r="11" fill="#ffe58a"/><circle cx="29" cy="20.5" r="10" fill="#27305a"/>` +
        circles([[52, 14, 1.4], [76, 26, 1.1], [14, 60, 1.2], [108, 52, 1.5], [100, 140, 1.3], [16, 132, 1.5], [62, 148, 1.1]], '#fff') +
        sparkle(90, 16, 4, '#ffe58a') +
        sparkle(106, 100, 3, '#ffe58a')
      );
    case 'sakura': {
      const petals = [[16, 18, 20], [42, 10, -30], [86, 16, 50], [106, 34, -10], [10, 70, 70], [112, 86, 30], [18, 128, -40], [98, 138, 15], [58, 146, -60], [70, 28, 80]];
      return (
        fillRect('#fdeaf0') +
        petals.map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="3" fill="#f7a8bd" transform="rotate(${a} ${x} ${y})"/>`).join('')
      );
    }
    // 青海波(せいがいは)。上の段から順にかき、下の段が上にかさなる
    case 'seigaiha': {
      let waves = '';
      for (let row = 0; row < 15; row++) {
        for (let col = -1; col < 7; col++) {
          const x = col * 20 + (row % 2) * 10;
          const y = row * 11;
          waves += [12, 9, 6, 3].map((r, i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 2 ? '#e8f0fa' : '#5d86c4'}"/>`).join('');
        }
      }
      return fillRect('#e8f0fa') + waves;
    }
    // 市松(いちまつ)もよう
    case 'ichimatsu': {
      let squares = '';
      for (let y = 0; y < H; y += 15) for (let x = 0; x < W; x += 15) if ((x + y) % 30 === 0) squares += `M${x} ${y}h15v15h-15Z`;
      return fillRect('#e3f1e7') + `<path d="${squares}" fill="#a9d4b6"/>`;
    }
    case 'fuji':
      return (
        fillRect('#d8ecf7') +
        `<circle cx="98" cy="24" r="11" fill="${RED}" opacity="0.85"/>` +
        `<path d="M-20 156L60 64L140 156Z" fill="#4a6fa5"/>` +
        `<path d="M60 64L41 86Q50 82 54 89Q60 82 66 89Q70 82 79 86Z" fill="#fff"/>`
      );
    case 'castle':
      return (
        fillRect('#fde9c8') +
        `<circle cx="96" cy="22" r="12" fill="#f6a04d"/>` +
        `<g transform="translate(6 6)">` +
        `<path d="M2 40L6 30H34L38 40Z" fill="#b9a68a"/>` +
        `<rect x="9" y="20" width="22" height="10" fill="#fff"/><path d="M4 22L20 15L36 22Z" fill="#3c4660"/>` +
        `<rect x="13" y="9" width="14" height="8" fill="#fff"/><path d="M8 11L20 3L32 11Z" fill="#3c4660"/></g>`
      );
    case 'snow':
      return (
        fillRect('#dcecf5') +
        `<ellipse cx="60" cy="160" rx="90" ry="22" fill="#fff"/>` +
        circles([[16, 16, 2.6], [44, 10, 1.8], [78, 20, 2.4], [104, 12, 1.9], [10, 58, 2], [110, 66, 2.6], [20, 104, 1.8], [102, 112, 2.2], [60, 24, 1.6]], '#fff')
      );
    // 浮世絵の大波
    case 'nami':
      return (
        fillRect('#f3ead2') +
        `<path d="M-30 156L60 96L150 156Z" fill="#9db4c8" opacity="0.5"/>` +
        `<path fill="#2c5f8a" d="M0 156V116Q22 92 46 106Q30 110 34 124Q50 100 72 120Q92 98 120 112V156Z"/>` +
        circles([[46, 106, 3], [40, 110, 2.4], [34, 116, 2], [72, 120, 2.6], [78, 114, 2.2], [114, 112, 2.4]], '#fff') +
        `<path fill="none" stroke="#2c5f8a" stroke-width="2" d="M8 20Q20 12 32 20M80 14Q92 6 104 14"/>`
      );
    // 明治の町のガス灯
    case 'gaslight':
      return (
        fillRect('#2f3b5c') +
        `<circle cx="18" cy="24" r="16" fill="#ffd96a" opacity="0.25"/>` +
        `<rect x="16" y="32" width="4" height="124" fill="#1b2238"/>` +
        `<path d="M10 16H26L23 32H13Z" fill="#ffe7a0" stroke="#1b2238" stroke-width="2"/><path d="M9 16L18 9L27 16Z" fill="#1b2238"/>` +
        circles([[70, 14, 1.3], [104, 30, 1.1], [94, 8, 1.4]], '#fff')
      );
    // 金屏風(きんびょうぶ)
    case 'kinbyobu': {
      let lines = '';
      for (let x = 20; x < W; x += 20) lines += `M${x} 0V${H}`;
      return (
        fillRect('#e9c75b') +
        `<path d="M0 30H120M0 70H120M0 112H120" stroke="#f4dc8a" stroke-width="6" opacity="0.5"/>` +
        `<path d="${lines}" stroke="#c9a33a" stroke-width="1.6"/>`
      );
    }
    case 'gold': {
      let rays = '';
      for (let i = 0; i < 12; i++) rays += `<path d="M60 84L${60 - 14} -40L${60 + 14} -40Z" fill="#f2d56a" transform="rotate(${i * 30} 60 84)"/>`;
      return fillRect('#f8e9ad') + rays + sparkle(16, 20, 6, '#fff') + sparkle(104, 28, 4.5, '#fff') + sparkle(102, 136, 6, '#fff') + sparkle(18, 132, 4, '#fff');
    }
    // 和紙
    default:
      return (
        fillRect('#f6efe0') +
        `<path fill="none" stroke="#e2d4b5" stroke-width="1.2" stroke-linecap="round" d="M10 20q8 4 16 0M80 14q10 5 20 -2M18 70q6 6 14 2M96 60q8 -4 14 3M14 130q10 4 18 -1M84 140q8 5 20 0M50 30q6 3 12 0"/>` +
        `<rect x="8" y="8" width="104" height="140" rx="4" fill="none" stroke="#dccaa6" stroke-width="1.2"/>`
      );
  }
}

const FRAMES = {
  plain: `<rect x="1.5" y="1.5" width="117" height="153" rx="7" fill="none" stroke="#6aa893" stroke-width="3"/>`,
  silver:
    `<rect x="2.5" y="2.5" width="115" height="151" rx="6.5" fill="none" stroke="#aeb8c4" stroke-width="5"/>` +
    `<rect x="5.5" y="5.5" width="109" height="145" rx="4.5" fill="none" stroke="#f1f4f7" stroke-width="1.2"/>`,
  gold:
    `<rect x="2.5" y="2.5" width="115" height="151" rx="6.5" fill="none" stroke="#d9a520" stroke-width="5"/>` +
    `<rect x="5.5" y="5.5" width="109" height="145" rx="4.5" fill="none" stroke="#fff3c4" stroke-width="1.2"/>`,
};

let clipSeq = 0;

/** 表向きのカードの絵 */
export function cardSvg(card: Card): string {
  const clip = `card-clip-${clipSeq++}`;
  return (
    `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${card.name}">` +
    `<clipPath id="${clip}"><rect width="${W}" height="${H}" rx="8"/></clipPath>` +
    `<g clip-path="url(#${clip})">${background(card.bg)}` +
    `<g transform="translate(9 37) scale(0.85)">${sparrowBody(card.look)}</g>` +
    `</g>${FRAMES[card.frame]}</svg>`
  );
}
