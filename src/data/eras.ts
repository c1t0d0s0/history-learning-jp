/** 時代の区切り。できごとはどれか 1 つに入る */
export type EraId = 'ancient' | 'classical' | 'medieval' | 'sengoku' | 'edo' | 'modern' | 'showa';

export interface Stage {
  /** 'all' は全部の時代から出す */
  id: EraId | 'all';
  title: string;
  /** タイルにそえる短い説明 */
  sub: string;
}

/** 時代ごとの練習。ならび順がホームのタイルの順 */
export const STAGES: Stage[] = [
  { id: 'ancient', title: '旧石器(きゅうせっき)〜古墳(こふん)', sub: '大昔のくらしと 国の始まり' },
  { id: 'classical', title: '飛鳥(あすか)・奈良(なら)・平安(へいあん)', sub: '天皇と 貴族(きぞく)の 政治' },
  { id: 'medieval', title: '鎌倉(かまくら)・室町(むろまち)', sub: '武士の 政治の 始まり' },
  { id: 'sengoku', title: '戦国(せんごく)・安土桃山(あづちももやま)', sub: '天下統一(てんかとういつ)への 道' },
  { id: 'edo', title: '江戸(えど)', sub: '260年 続いた 幕府(ばくふ)' },
  { id: 'modern', title: '明治(めいじ)・大正(たいしょう)', sub: '新しい 国づくり' },
  { id: 'showa', title: '昭和(しょうわ)〜現代', sub: '戦争と 平和な 日本' },
  { id: 'all', title: '時代を こえて', sub: '全部の 時代から 出るよ' },
];

export const ERA_IDS: EraId[] = STAGES.map((s) => s.id).filter((id): id is EraId => id !== 'all');

export function stageById(id: string): Stage | undefined {
  return STAGES.find((s) => s.id === id);
}
