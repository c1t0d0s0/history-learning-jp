/** スズメの絵柄の指定。指定しない項目は、タイトル画面のスズメと同じになる */
export interface Look {
  fur?: string;
  light?: string;
  wing?: string;
  /** 目に色をつける (夜のスズメなど) */
  eyeColor?: string;
  /** hole は、はにわのような穴の目 */
  eyes?: 'open' | 'wink' | 'sleep' | 'happy' | 'sparkle' | 'brave' | 'hole';
  /** くちばし。何も書かなければとじている */
  mouth?: 'open';
  items?: Item[];
}

export type Item =
  | 'magatama'
  | 'eboshi'
  | 'kanmuri'
  | 'junihitoe'
  | 'makimono'
  | 'fude'
  | 'chonmage'
  | 'kasa'
  | 'sensu'
  | 'katana'
  | 'kabuto'
  | 'gunbai'
  | 'headband'
  | 'gakubou'
  | 'book'
  | 'glasses'
  | 'bowtie';

export type Background =
  | 'washi'
  | 'night'
  | 'sakura'
  | 'seigaiha'
  | 'ichimatsu'
  | 'fuji'
  | 'castle'
  | 'snow'
  | 'nami'
  | 'gaslight'
  | 'kinbyobu'
  | 'gold';

export interface Card {
  id: string;
  /** 3 年生でも読めるよう、漢字は 3 年生までに習うものだけ */
  name: string;
  price: number;
  look: Look;
  bg: Background;
  frame: 'plain' | 'silver' | 'gold';
}

/**
 * 値段の安い順。むかしの時代のスズメから、だんだん新しい時代へ。最後は「天下人」。
 * 合計は 28,420pt。次のようになるように決めてある (tests/rewards.test.ts で確かめている)。
 * - 今日のチャレンジを毎日 1 つクリアする人が、はじめの 5 枚を 2 週間以内に手に入れられる
 *   (1 日 20pt と、7 日つづくたびの 1000pt で、2・6・7・7・14 日目に買える)
 * - そのあとは、1 枚ごとに少しずつ時間がかかる
 * - 全部集めるには、少なくとも 3 か月ほどの連続プレイがいる
 * 値段を変えるときは、合計がこの条件から外れないように気をつけること。
 */
export const CARDS: Card[] = [
  { id: 'c01', name: 'まがたま スズメ', price: 40, look: { items: ['magatama'] }, bg: 'washi', frame: 'plain' },
  { id: 'c02', name: 'はにわ スズメ', price: 80, look: { eyes: 'hole', fur: '#d4935a', light: '#e8b583', wing: '#b4733f' }, bg: 'washi', frame: 'plain' },
  { id: 'c03', name: 'えぼしの スズメ', price: 300, look: { items: ['eboshi'], eyes: 'sleep' }, bg: 'night', frame: 'plain' },
  { id: 'c04', name: '十二ひとえの スズメ', price: 500, look: { items: ['junihitoe'], eyes: 'happy', mouth: 'open' }, bg: 'sakura', frame: 'plain' },
  { id: 'c05', name: 'かんむりの スズメ', price: 800, look: { items: ['kanmuri'], fur: '#c98a4e' }, bg: 'seigaiha', frame: 'plain' },
  { id: 'c06', name: 'まき物の スズメ', price: 1000, look: { items: ['makimono'], eyes: 'wink' }, bg: 'washi', frame: 'plain' },
  { id: 'c07', name: '筆の スズメ', price: 1100, look: { items: ['fude', 'eboshi'], eyes: 'brave' }, bg: 'ichimatsu', frame: 'plain' },
  { id: 'c08', name: 'ちょんまげ スズメ', price: 1200, look: { items: ['chonmage'], eyes: 'happy', mouth: 'open' }, bg: 'ichimatsu', frame: 'plain' },
  { id: 'c09', name: 'たびの スズメ', price: 1300, look: { items: ['kasa'], fur: '#a8683a' }, bg: 'fuji', frame: 'plain' },
  { id: 'c10', name: 'せんすの スズメ', price: 1400, look: { items: ['junihitoe', 'sensu'], eyes: 'wink', fur: '#c98a4e' }, bg: 'sakura', frame: 'plain' },
  { id: 'c11', name: 'さむらい スズメ', price: 1500, look: { items: ['chonmage', 'katana'], eyes: 'brave' }, bg: 'castle', frame: 'silver' },
  { id: 'c12', name: 'かぶとの スズメ', price: 1600, look: { items: ['kabuto'], eyes: 'brave', mouth: 'open' }, bg: 'seigaiha', frame: 'silver' },
  { id: 'c13', name: '雪の たびびと スズメ', price: 1700, look: { fur: '#f3f1ea', light: '#ffffff', wing: '#d9d6cc', items: ['kasa'] }, bg: 'snow', frame: 'silver' },
  { id: 'c14', name: 'しのびの スズメ', price: 1800, look: { fur: '#4a4e6e', light: '#9a9eb8', wing: '#2f3250', eyeColor: '#ffd94a', items: ['headband', 'katana'] }, bg: 'night', frame: 'silver' },
  { id: 'c15', name: 'うきよえ スズメ', price: 1900, look: { items: ['chonmage', 'sensu'], eyes: 'happy', mouth: 'open' }, bg: 'nami', frame: 'silver' },
  { id: 'c16', name: 'がくせい スズメ', price: 2000, look: { items: ['gakubou', 'book'], eyes: 'brave' }, bg: 'gaslight', frame: 'silver' },
  { id: 'c17', name: 'ハイカラ スズメ', price: 2200, look: { items: ['bowtie', 'glasses'], eyes: 'sparkle', mouth: 'open', fur: '#a8683a' }, bg: 'gaslight', frame: 'gold' },
  { id: 'c18', name: 'ぐんばいの スズメ', price: 2400, look: { items: ['kabuto', 'gunbai'], eyes: 'sparkle' }, bg: 'castle', frame: 'gold' },
  { id: 'c19', name: 'おひめさま スズメ', price: 2600, look: { items: ['junihitoe', 'sensu'], eyes: 'sparkle', fur: '#e0a955', wing: '#b97f33' }, bg: 'kinbyobu', frame: 'gold' },
  { id: 'c20', name: '天下人の スズメ', price: 3000, look: { items: ['kabuto', 'katana', 'gunbai'], eyes: 'sparkle', mouth: 'open', fur: '#e3b24a', wing: '#b98523' }, bg: 'gold', frame: 'gold' },
];
