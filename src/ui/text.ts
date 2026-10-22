import { CLEAR_POINTS, GAME_EVENTS, MONTH_POINTS, STAGE_PASS_MISTAKES, WEEK_LENGTH, WEEK_POINTS } from '../core/rewards';

const pt = (n: number) => `${n.toLocaleString('ja-JP')}pt`;

/**
 * 画面の文言。6 年生向けに、分かち書きにする。
 * ふりがなを付けたい言葉は「漢字(よみ)」と書き、withRuby で出す。
 * スタンプカード・スズメカード・ログインの文は、社会クイズと同じ (3 年生でも読める表記)
 */
export const T = {
  brand: '日本史ならべ',
  lead: '日本の 歴史の できごとを 年表に ならべよう。小学校の 社会と 中学受験に 出る できごと。',
  daily: '今日の チャレンジ',
  dateLabel: (m: number, d: number, w: number) => `${m}月${d}日（${'日月火水木金土'[w]}）`,
  dailyNote: (done: boolean, run: number) =>
    done
      ? run > 1
        ? `クリアずみ。${run}日 つづいて いるよ。`
        : 'クリアずみ。あしたも 新しい カードが 出るよ。'
      : run > 0
        ? `${run}日 つづけて クリア中。今日も やって みよう。`
        : `毎日 ${GAME_EVENTS}つの できごと。全部 ならべると スタンプを 1こ おせるよ。`,
  start: 'はじめる',
  resume: 'つづきから',
  review: 'けっかを 見る',
  stagesTitle: '時代ごとの 練習',
  stagesNote: `ミス ${STAGE_PASS_MISTAKES}回までで クリア（${CLEAR_POINTS}pt）。やる たびに ちがう できごとが 出るよ。`,
  playing: 'とちゅう',
  cleared: 'クリア',
  timelineTitle: '年表(ねんぴょう)ずかん',
  timelineNote: 'できごとと 年、関係する 人物を 時代の 順に 見られるよ。',
  seeTimeline: '年表(ねんぴょう)ずかんを 見る',
  howto: 'あそびかた',
  howtoItems: [
    '「今日の チャレンジ」か、時代ごとの 練習を えらびます。',
    'できごとの カードを、年表の 古い 順（左が むかし）に ならべます。',
    '人物の カードを、関係する できごとの 下に ならべます。',
    'カードを タップして えらび、置きたい 場所を タップします。ドラッグでも 動かせます。',
    'まちがえると カードが 手札に もどります。全部 ならべると、何年の できごとか 分かります。',
    `「今日の チャレンジ」を さいごまで やると、スタンプと ${CLEAR_POINTS}pt が もらえます。ポイントを ためると、スズメの カードと 交かん できます。`,
  ],
  // ゲームの画面
  past: 'むかし',
  now: 'いま',
  boardLabel: '年表',
  handTitle: '手札',
  handNote: 'カードを えらんで、年表に 置こう',
  handEmpty: '全部 ならべたよ！',
  eventTag: 'できごと',
  personTag: '人物',
  slotEvent: (n: number) => `${n}番目の できごと`,
  slotPerson: '人物',
  slotEventLabel: (n: number) => `左から ${n}番目の できごとの 場所`,
  slotPersonLabel: (title: string) => `「${title}」の 人物の 場所`,
  mistakes: (n: number) => `ミス ${n}`,
  placedCount: (n: number, total: number) => `${n} / ${total}まい`,
  pickHint: 'どこに 置く？ 光って いる 場所を タップしよう',
  needEvent: '先に、できごとの カードを 置こう',
  wrongEvent: 'その 順番では ないよ',
  wrongPerson: 'その できごとの 人物では ないよ',
  elsewhere: 'この 人物は そこにも 関係が あるけど、今回は ほかの できごとの 下だよ',
  correct: '正かい！',
  // けっか
  resultTitle: 'ならべ終わった！',
  resultMistakes: (n: number) => (n === 0 ? 'ミス なし！ すごい！' : `ミス ${n}回`),
  resultPass: 'クリア！',
  resultTry: `ミスが ${STAGE_PASS_MISTAKES}回 までなら クリア。せつ明を 読んで、もう一回 ちょうせん しよう。`,
  resultDaily: 'おつかれさま。年表と せつ明を 見直そう。',
  reviewTitle: 'ふりかえり',
  retry: `つぎの ${GAME_EVENTS}つに ちょうせん`,
  goHome: 'ホームに もどる',
  // スタンプカード・ポイント・スズメカード
  stampTitle: 'スタンプカード',
  stampMonth: (month: number) => `${month}月`,
  stampDayLabel: (day: number, stamped: boolean) => `${day}日${stamped ? ' スタンプあり' : ''}`,
  stampRun: (run: number, left: number) =>
    run > 0 ? `${run}日 つづいて いるよ。あと ${left}日で ${pt(WEEK_POINTS)}。` : '今日の チャレンジを やると、スタンプを 1こ おせるよ。',
  stampRule: `ゲームを 1つ クリアすると ${CLEAR_POINTS}pt。今日の チャレンジを ${WEEK_LENGTH}日 つづける たびに ${pt(WEEK_POINTS)}、1日から 月の さいごの 日まで 全部 そろうと、さらに ${pt(MONTH_POINTS)}。`,
  stampDone: 'スタンプを おしたよ',
  rewardClear: (points: number) => `クリア！ +${points}pt`,
  rewardWeek: (run: number) => `${run}日 つづいた！ +${pt(WEEK_POINTS)}`,
  rewardMonth: (month: number) => `${month}月の スタンプが 全部 そろった！ +${pt(MONTH_POINTS)}`,
  points: pt,
  pointsLabel: '持っている ポイント',
  seeCards: 'カードを 見る',
  seeStamps: 'スタンプカードを 見る',
  rewardLinks: 'スタンプカードと スズメカード',
  soundOn: '音：オン',
  soundOff: '音：オフ',
  // ログインと記録の保存 (ログインは保護者がすることも多いが、文は子どもにも読める表記にする)
  accountTitle: 'きろくの ほぞん',
  accountNote: 'Googleで ログインすると、ほかの ブラウザや たんまつでも 同じ きろくで 遊べます。ログインしなくても 遊べます。',
  signIn: 'Googleで ログイン',
  signedIn: 'ログイン中',
  signOut: 'ログアウト',
  syncLoading: 'たしかめています…',
  syncSaving: 'ほぞん中…',
  syncSaved: 'ほぞんずみ',
  syncOffline: 'まだ ほぞんできていません。つながったら ほぞんします。',
  askMigrate:
    'この たんまつの きろくを アカウントに うつしますか？\n\n「OK」… うつす (アカウントの きろくと 合わせます)\n「キャンセル」… うつさない (たんまつの きろくは そのまま のこります)',
  signOutUnsynced: 'まだ ほぞんできていない きろくが あります。今 ログアウトすると、その分は なくなります。ログアウトしますか？',
  signInFailed: 'ログインできませんでした。もういちど ためしてください。',
  cardsTitle: 'スズメカード',
  cardsLead: 'ポイントを ためて、歴史の スズメの カードを 集めよう。',
  cardsOwned: (n: number, total: number) => `${n} / ${total}まい`,
  cardGet: 'ゲットする',
  cardShort: (n: number) => `あと ${pt(n)}`,
  cardConfirm: (price: number) => `${pt(price)}を 使って、この カードを ゲットしますか？`,
  cardBackLabel: (price: number) => `まだ 持っていない カード。${pt(price)}で ゲットできる`,
};

export type Text = typeof T;
