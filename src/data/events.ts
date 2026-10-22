import type { EraId } from './eras';

/**
 * できごとのカード。
 * - ふりがなは「漢字(よみ)」と半角かっこで書く。説明のためのかっこは全角（）を使う
 * - title には、カードにする人物の名前を入れない (答えが分かってしまうので)
 * - from / to はならべる順を決める年。紀元前や「○年前」は負の数にする (およその値でよい)。
 *   to があるもの (縄文時代など) は期間で、同じゲームには年の範囲が重なるものを出さない (src/core/game.ts)
 * - when はクリアしたときに出す年の表示
 * - people は関係する人物 (src/data/people.ts の id)。大事な順に 3 人まで
 */
export interface HistEvent {
  id: string;
  era: EraId;
  from: number;
  to?: number;
  when: string;
  title: string;
  people: string[];
  note: string;
}

export const EVENTS: HistEvent[] = [
  // ---- 旧石器〜古墳 ----
  {
    id: 'paleolithic', era: 'ancient', from: -36000, to: -14000, when: '約3万8000年前〜約1万6000年前',
    title: '旧石器(きゅうせっき)時代', people: [],
    note: '打製石器(だせいせっき)を使い、ナウマンゾウなどの大きな動物をかって くらしていました。群馬県の岩宿(いわじゅく)遺跡(いせき)で、この時代の石器が見つかりました。',
  },
  {
    id: 'jomon', era: 'ancient', from: -14000, to: -400, when: '約1万6000年前〜約2400年前',
    title: '縄文(じょうもん)時代', people: [],
    note: '縄文土器(どき)を使い、たて穴住居(あなじゅうきょ)に住んで、狩(か)りや漁、木の実の採集(さいしゅう)で くらしていました。青森県の三内丸山(さんないまるやま)遺跡が有名です。',
  },
  {
    id: 'yayoi', era: 'ancient', from: -400, to: 250, when: '約2400年前〜3世紀ごろ',
    title: '弥生(やよい)時代', people: [],
    note: '大陸から米づくりが伝わり、人々は むらをつくって定住しました。米や土地をめぐる争いから、くにが生まれました。佐賀県の吉野ヶ里(よしのがり)遺跡が有名です。',
  },
  {
    id: 'kinin', era: 'ancient', from: 57, when: '57年',
    title: '奴国(なのくに)の王が 漢(かん)から 金印(きんいん)を さずかる', people: ['kobutei'],
    note: '奴国の王が中国の漢に使いを送り、皇帝(こうてい)の光武帝から金印をさずかりました。この金印は、江戸時代に福岡県の志賀島(しかのしま)で見つかりました。',
  },
  {
    id: 'himiko', era: 'ancient', from: 239, when: '239年',
    title: '邪馬台国(やまたいこく)の 女王が 魏(ぎ)に 使いを送る', people: ['himiko'],
    note: '邪馬台国の女王・卑弥呼は、30ほどのくにを従えていました。中国の魏に使いを送り、「親魏倭王(しんぎわおう)」の称号(しょうごう)と銅の鏡などをさずかりました。',
  },
  {
    id: 'kofun', era: 'ancient', from: 270, when: '3世紀後半ごろ',
    title: '各地で 古墳(こふん)が つくられ始める', people: [],
    note: '王や豪族(ごうぞく)の墓として、大きな古墳がつくられるようになりました。大阪府の大仙(だいせん)古墳は、日本最大の前方後円墳(ぜんぽうこうえんふん)です。まわりには はにわが ならべられました。',
  },
  {
    id: 'wakatakeru', era: 'ancient', from: 471, when: '471年',
    title: '稲荷山(いなりやま)古墳の 鉄剣(てっけん)に 大王の名が きざまれる', people: ['wakatakeru'],
    note: '埼玉県の稲荷山古墳から出た鉄剣に「ワカタケル大王」の名がきざまれていました。熊本県の江田船山(えたふなやま)古墳の鉄刀にも同じ名があり、大和朝廷(やまとちょうてい)の力が九州から関東まで広がっていたことが分かります。',
  },
  {
    id: 'bukkyo', era: 'ancient', from: 538, when: '538年',
    title: '仏教(ぶっきょう)が 伝わる', people: ['seimei-o'],
    note: '朝鮮半島(ちょうせんはんとう)の百済(くだら)の聖明王から、仏像や経典(きょうてん)がおくられました。552年とする説もあります。',
  },
  {
    id: 'soga-mononobe', era: 'ancient', from: 587, when: '587年',
    title: '蘇我(そが)氏が 物部(もののべ)氏を たおす', people: ['soga-umako', 'mononobe-moriya'],
    note: '仏教を広めようとする蘇我馬子と、反対する物部守屋が争い、蘇我氏が勝って力を強めました。',
  },

  // ---- 飛鳥・奈良・平安 ----
  {
    id: 'shotoku-sessho', era: 'classical', from: 593, when: '593年',
    title: '摂政(せっしょう)が 天皇を 助けて 政治を 始める', people: ['shotoku', 'suiko'],
    note: '推古天皇の摂政となった聖徳太子は、蘇我馬子(そがのうまこ)と協力して、天皇中心の国づくりを進めました。',
  },
  {
    id: 'kani', era: 'classical', from: 603, when: '603年',
    title: '冠位十二階(かんいじゅうにかい)が 定められる', people: ['shotoku'],
    note: '家がらではなく、能力や手がらのある人を役人に取り立てるしくみです。位は冠(かんむり)の色で区別しました。',
  },
  {
    id: 'kenpo17', era: 'classical', from: 604, when: '604年',
    title: '十七条の 憲法(けんぽう)が 定められる', people: ['shotoku'],
    note: '役人の心がまえを示したきまりです。「和を大切にすること」「仏教をあつく信じること」「天皇の命令に従うこと」などが書かれています。',
  },
  {
    id: 'kenzuishi', era: 'classical', from: 607, when: '607年',
    title: '遣隋使(けんずいし)が 送られる', people: ['ono-imoko', 'shotoku'],
    note: '聖徳太子は、中国の隋(ずい)の進んだ政治や文化を学ぶため、小野妹子らを遣隋使として送りました。同じ年に法隆寺(ほうりゅうじ)が建てられたといわれています。',
  },
  {
    id: 'taika', era: 'classical', from: 645, when: '645年',
    title: '大化(たいか)の 改新(かいしん)が 始まる', people: ['nakanooe', 'kamatari'],
    note: '中大兄皇子と中臣鎌足が蘇我(そが)氏をたおし、土地と人民を国のものとする（公地公民(こうちこうみん)）など、天皇中心の国づくりを始めました。',
  },
  {
    id: 'hakusonko', era: 'classical', from: 663, when: '663年',
    title: '白村江(はくすきのえ)の 戦い', people: ['nakanooe'],
    note: '百済(くだら)を助けるために朝鮮半島に兵を送りましたが、唐(とう)と新羅(しらぎ)の連合軍に大敗しました。',
  },
  {
    id: 'jinshin', era: 'classical', from: 672, when: '672年',
    title: '壬申(じんしん)の 乱', people: ['oama'],
    note: '天智天皇(てんじてんのう)の死後、あとつぎをめぐる争いが起こり、勝った大海人皇子が天武天皇(てんむてんのう)となりました。',
  },
  {
    id: 'taiho', era: 'classical', from: 701, when: '701年',
    title: '大宝律令(たいほうりつりょう)が 完成する', people: ['fuhito'],
    note: '藤原不比等らがまとめた、国を治めるための法律です。律は刑罰(けいばつ)、令は政治のしくみのきまりです。',
  },
  {
    id: 'heijo', era: 'classical', from: 710, when: '710年',
    title: '平城京(へいじょうきょう)に 都が うつる', people: ['genmei'],
    note: '元明天皇のときに、唐(とう)の都・長安(ちょうあん)にならって、奈良に平城京がつくられました。ここから奈良時代です。',
  },
  {
    id: 'kojiki', era: 'classical', from: 712, when: '712年',
    title: '「古事記(こじき)」が 完成する', people: ['yasumaro', 'hieda-no-are'],
    note: '稗田阿礼が覚えていた神話や伝説を、太安万侶が書きとめてまとめた、日本で最も古い歴史書です。',
  },
  {
    id: 'nihonshoki', era: 'classical', from: 720, when: '720年',
    title: '「日本書紀(にほんしょき)」が 完成する', people: ['toneri'],
    note: '舎人親王らがまとめた、国の正式な歴史書です。漢文で書かれています。',
  },
  {
    id: 'konden', era: 'classical', from: 743, when: '743年',
    title: '墾田永年私財法(こんでんえいねんしざいほう)が 出される', people: ['shomu'],
    note: '新しく開墾(かいこん)した土地は、いつまでも自分のものにしてよいとした法律です。公地公民のしくみがくずれるきっかけになりました。',
  },
  {
    id: 'daibutsu', era: 'classical', from: 752, when: '752年',
    title: '東大寺(とうだいじ)の 大仏が 完成する', people: ['shomu', 'gyoki'],
    note: '聖武天皇は、仏教の力で国を守ろうと、東大寺に大仏をつくらせました。行基は、人々に協力をよびかけました。',
  },
  {
    id: 'ganjin', era: 'classical', from: 753, when: '753年',
    title: '唐(とう)の 高僧(こうそう)が 来日する', people: ['ganjin'],
    note: '鑑真は、何度も航海に失敗し、目が見えなくなりながらも日本にわたり、正しい仏教を伝えました。奈良に唐招提寺(とうしょうだいじ)を開きました。',
  },
  {
    id: 'heian', era: 'classical', from: 794, when: '794年',
    title: '平安京(へいあんきょう)に 都が うつる', people: ['kanmu'],
    note: '桓武天皇は、政治を立て直すため、京都に平安京をつくりました。ここから平安時代です。',
  },
  {
    id: 'tamuramaro', era: 'classical', from: 797, when: '797年',
    title: '征夷大将軍(せいいたいしょうぐん)が 東北地方に 送られる', people: ['tamuramaro'],
    note: '桓武天皇(かんむてんのう)は坂上田村麻呂を征夷大将軍に任じ、朝廷に従わない東北地方の蝦夷(えみし)を従えさせました。',
  },
  {
    id: 'saicho-kukai', era: 'classical', from: 804, when: '804年',
    title: '2人の 僧が 遣唐使(けんとうし)と 唐に わたる', people: ['saicho', 'kukai'],
    note: '帰国後、最澄は天台宗(てんだいしゅう)を、空海は真言宗(しんごんしゅう)を開き、山の中の寺で修行する新しい仏教を広めました。',
  },
  {
    id: 'kentoshi-stop', era: 'classical', from: 894, when: '894年',
    title: '遣唐使(けんとうし)が 停止される', people: ['michizane'],
    note: '菅原道真の意見で、遣唐使が停止されました。これ以後、日本の風土に合った国風(こくふう)文化が育ちました。',
  },
  {
    id: 'kokinshu', era: 'classical', from: 905, when: '905年',
    title: '「古今和歌集(こきんわかしゅう)」が つくられる', people: ['tsurayuki'],
    note: '天皇の命令でつくられた、はじめての和歌集です。紀貫之らが選びました。紀貫之は、かな文字で「土佐日記(とさにっき)」も書きました。',
  },
  {
    id: 'masakado', era: 'classical', from: 939, when: '939年',
    title: '関東で 武士が 反乱を 起こす', people: ['masakado'],
    note: '平将門が関東で反乱を起こし、自らを「新皇(しんのう)」と名のりました。武士の力が強まってきたことを示すできごとです。',
  },
  {
    id: 'makura', era: 'classical', from: 1000, when: '1000年ごろ',
    title: '「枕草子(まくらのそうし)」が 書かれる', people: ['sei-shonagon'],
    note: '天皇のきさき・定子(ていし)に仕えた清少納言が、宮中のくらしや自然について書いた随筆(ずいひつ)です。',
  },
  {
    id: 'genji', era: 'classical', from: 1008, when: '1008年ごろ',
    title: '「源氏物語(げんじものがたり)」が 書かれる', people: ['murasaki'],
    note: '紫式部が、かな文字で書いた長い物語です。光源氏(ひかるげんじ)を主人公に、貴族のくらしがえがかれています。',
  },
  {
    id: 'michinaga', era: 'classical', from: 1016, when: '1016年',
    title: '摂関政治(せっかんせいじ)が 最も さかえる', people: ['michinaga'],
    note: '藤原道長は、むすめを天皇のきさきにして摂政(せっしょう)となり、大きな力をもちました。「この世をば わが世とぞ思う 望月(もちづき)の…」という歌をよみました。',
  },
  {
    id: 'byodoin', era: 'classical', from: 1053, when: '1053年',
    title: '平等院鳳凰堂(びょうどういんほうおうどう)が 建てられる', people: ['yorimichi'],
    note: '藤原道長の子・頼通が、京都の宇治(うじ)に建てた阿弥陀堂(あみだどう)です。10円玉にえがかれています。',
  },
  {
    id: 'insei', era: 'classical', from: 1086, when: '1086年',
    title: '院政(いんせい)が 始まる', people: ['shirakawa'],
    note: '白河天皇は、位をゆずって上皇となったあとも、政治を行いました。これを院政といいます。',
  },
  {
    id: 'heiji', era: 'classical', from: 1159, when: '1159年',
    title: '平治(へいじ)の 乱', people: ['kiyomori', 'yoshitomo'],
    note: '平清盛が源義朝をやぶり、平氏が大きな力をもつようになりました。',
  },
  {
    id: 'dajodaijin', era: 'classical', from: 1167, when: '1167年',
    title: '武士として はじめて 太政大臣(だじょうだいじん)になる', people: ['kiyomori'],
    note: '平清盛は太政大臣となり、むすめを天皇のきさきにして政治の実権をにぎりました。また、宋(そう)との貿易を進めました。',
  },
  {
    id: 'dannoura', era: 'classical', from: 1185, when: '1185年',
    title: '壇ノ浦(だんのうら)の 戦い', people: ['yoshitsune'],
    note: '源義経らが、山口県の壇ノ浦で平氏をほろぼしました。',
  },

  // ---- 鎌倉・室町 ----
  {
    id: 'kamakura', era: 'medieval', from: 1185, when: '1185年',
    title: '鎌倉幕府(かまくらばくふ)が 開かれる', people: ['yoritomo'],
    note: '源頼朝は、全国に守護(しゅご)と地頭(じとう)を置くことを朝廷に認めさせ、鎌倉で武士の政治を始めました。1192年には征夷大将軍(せいいたいしょうぐん)に任じられました。',
  },
  {
    id: 'kongorikishi', era: 'medieval', from: 1203, when: '1203年',
    title: '東大寺(とうだいじ)の 金剛力士像(こんごうりきしぞう)が つくられる', people: ['unkei', 'kaikei'],
    note: '運慶と快慶らが、わずか70日ほどでつくりあげた、高さ8mをこえる力強い像です。東大寺の南大門に置かれています。',
  },
  {
    id: 'jokyu', era: 'medieval', from: 1221, when: '1221年',
    title: '承久(じょうきゅう)の 乱', people: ['gotoba', 'masako'],
    note: '後鳥羽上皇が幕府をたおそうと兵をあげましたが、北条政子が御家人(ごけにん)たちに頼朝のご恩を説いて団結させ、幕府が勝ちました。',
  },
  {
    id: 'goseibai', era: 'medieval', from: 1232, when: '1232年',
    title: '御成敗式目(ごせいばいしきもく)が 定められる', people: ['yasutoki'],
    note: '執権(しっけん)の北条泰時が定めた、武士のためのはじめての法律です。裁判の基準などが書かれています。',
  },
  {
    id: 'bunei', era: 'medieval', from: 1274, when: '1274年',
    title: '元(げん)が せめてくる（文永(ぶんえい)の役(えき)）', people: ['tokimune', 'kublai'],
    note: '元の皇帝フビライ・ハンは日本を従えようとしましたが、執権の北条時宗はこれをこばみました。元軍は集団戦法や火薬の武器で戦いました。',
  },
  {
    id: 'koan', era: 'medieval', from: 1281, when: '1281年',
    title: '元が ふたたび せめてくる（弘安(こうあん)の役(えき)）', people: ['suenaga', 'tokimune'],
    note: '幕府は博多湾(はかたわん)に石の防壁(ぼうへき)をきずいて備え、元軍は大きな損害を受けて引きあげました。竹崎季長は、元寇(げんこう)での活やくを絵巻物にえがかせました。',
  },
  {
    id: 'tokusei', era: 'medieval', from: 1297, when: '1297年',
    title: '永仁(えいにん)の 徳政令(とくせいれい)が 出される', people: [],
    note: '元寇のあと、恩賞(おんしょう)をもらえず生活に苦しむ御家人を救うため、借金を帳消しにする命令が出されました。',
  },
  {
    id: 'kamakura-end', era: 'medieval', from: 1333, when: '1333年',
    title: '鎌倉幕府(かまくらばくふ)が ほろびる', people: ['godaigo', 'takauji', 'yoshisada'],
    note: '後醍醐天皇のよびかけで、足利尊氏や新田義貞らが兵をあげ、鎌倉幕府はほろびました。',
  },
  {
    id: 'kenmu', era: 'medieval', from: 1334, when: '1334年',
    title: '建武(けんむ)の 新政(しんせい)が 始まる', people: ['godaigo'],
    note: '後醍醐天皇が天皇中心の政治を始めましたが、公家(くげ)を重んじたため武士の不満が高まり、2年ほどでくずれました。',
  },
  {
    id: 'muromachi', era: 'medieval', from: 1338, when: '1338年',
    title: '室町幕府(むろまちばくふ)が 開かれる', people: ['takauji'],
    note: '足利尊氏が征夷大将軍(せいいたいしょうぐん)となり、京都に幕府を開きました。同じころ、朝廷が南朝と北朝に分かれて争いました（南北朝時代）。',
  },
  {
    id: 'noh', era: 'medieval', from: 1374, when: '1374年',
    title: '能(のう)が 将軍に 認められる', people: ['kanami', 'zeami'],
    note: '観阿弥・世阿弥の親子は、足利義満(あしかがよしみつ)の保護を受けて、能を芸術として完成させました。',
  },
  {
    id: 'nanboku', era: 'medieval', from: 1392, when: '1392年',
    title: '南朝と 北朝が 一つになる', people: ['yoshimitsu'],
    note: '3代将軍・足利義満のときに、南朝と北朝が一つになりました。',
  },
  {
    id: 'kinkaku', era: 'medieval', from: 1397, when: '1397年',
    title: '金閣(きんかく)が 建てられる', people: ['yoshimitsu'],
    note: '足利義満が京都の北山(きたやま)に建てました。この時代の文化を北山文化といいます。',
  },
  {
    id: 'nichimin', era: 'medieval', from: 1404, when: '1404年',
    title: '日明(にちみん)貿易が 始まる', people: ['yoshimitsu'],
    note: '足利義満は、明(みん)と貿易を始めました。正式な貿易船は勘合(かんごう)という合い札を使ったので、勘合貿易ともいいます。',
  },
  {
    id: 'shocho', era: 'medieval', from: 1428, when: '1428年',
    title: '正長(しょうちょう)の 土一揆(つちいっき)', people: [],
    note: '近江(おうみ)の馬借(ばしゃく)が中心となって、借金の帳消しを求めて立ち上がりました。',
  },
  {
    id: 'onin', era: 'medieval', from: 1467, when: '1467年',
    title: '応仁(おうにん)の 乱', people: ['yoshimasa', 'katsumoto', 'sozen'],
    note: '8代将軍・足利義政のあとつぎ問題などから、細川勝元と山名宗全が対立し、京都を中心に11年も戦いが続きました。これをきっかけに戦国時代が始まりました。',
  },
  {
    id: 'yamashiro', era: 'medieval', from: 1485, when: '1485年',
    title: '山城(やましろ)の 国一揆(くにいっき)', people: [],
    note: '山城国（京都府南部）の武士や農民が、守護大名の畠山(はたけやま)氏を追い出し、8年間自分たちで治めました。',
  },
  {
    id: 'sesshu', era: 'medieval', from: 1486, when: '1486年',
    title: '水墨画(すいぼくが)「山水長巻(さんすいちょうかん)」が えがかれる', people: ['sesshu'],
    note: '明(みん)で水墨画を学んだ雪舟が、日本の水墨画を完成させました。',
  },
  {
    id: 'kaga', era: 'medieval', from: 1488, when: '1488年',
    title: '加賀(かが)の 一向一揆(いっこういっき)', people: [],
    note: '浄土真宗(じょうどしんしゅう)の信者たちが、加賀国（石川県）の守護大名をたおし、約100年間自分たちで治めました。',
  },
  {
    id: 'ginkaku', era: 'medieval', from: 1489, when: '1489年',
    title: '銀閣(ぎんかく)が 建てられる', people: ['yoshimasa'],
    note: '足利義政が京都の東山(ひがしやま)に建てました。となりの東求堂(とうぐどう)には、たたみやふすまを使った書院造(しょいんづくり)の部屋があります。',
  },

  // ---- 戦国・安土桃山 ----
  {
    id: 'teppo', era: 'sengoku', from: 1543, when: '1543年',
    title: '鉄砲(てっぽう)が 伝わる', people: ['tokitaka'],
    note: 'ポルトガル人を乗せた船が鹿児島県の種子島(たねがしま)に流れ着き、鉄砲が伝わりました。島の領主・種子島時尭が鉄砲を買い求めました。',
  },
  {
    id: 'christianity', era: 'sengoku', from: 1549, when: '1549年',
    title: 'キリスト教が 伝わる', people: ['xavier'],
    note: 'スペイン人の宣教師(せんきょうし)フランシスコ・ザビエルが鹿児島に来て、キリスト教を伝えました。',
  },
  {
    id: 'okehazama', era: 'sengoku', from: 1560, when: '1560年',
    title: '桶狭間(おけはざま)の 戦い', people: ['nobunaga', 'yoshimoto'],
    note: '織田信長が、大軍をひきいる今川義元を少ない兵でやぶり、名をあげました。',
  },
  {
    id: 'kawanakajima', era: 'sengoku', from: 1561, when: '1561年',
    title: '川中島(かわなかじま)で いちばんの 激戦(げきせん)', people: ['shingen', 'kenshin'],
    note: '武田信玄と上杉謙信は、長野県の川中島で5回も戦いました。1561年の4回目の戦いがいちばんの激戦でした。',
  },
  {
    id: 'muromachi-end', era: 'sengoku', from: 1573, when: '1573年',
    title: '室町幕府(むろまちばくふ)が ほろびる', people: ['yoshiaki', 'nobunaga'],
    note: '織田信長は、15代将軍・足利義昭を京都から追放し、室町幕府はほろびました。',
  },
  {
    id: 'nagashino', era: 'sengoku', from: 1575, when: '1575年',
    title: '長篠(ながしの)の 戦い', people: ['katsuyori', 'nobunaga', 'ieyasu'],
    note: '織田信長と徳川家康の連合軍が、大量の鉄砲を使って、武田勝頼の騎馬隊(きばたい)をやぶりました。',
  },
  {
    id: 'azuchi', era: 'sengoku', from: 1576, when: '1576年',
    title: '安土城(あづちじょう)の 建設が 始まる', people: ['nobunaga'],
    note: '織田信長は、琵琶湖(びわこ)のほとりに、天守をもつ安土城を築き、天下統一の拠点(きょてん)にしました。',
  },
  {
    id: 'rakuichi', era: 'sengoku', from: 1577, when: '1577年',
    title: '城下町で 楽市(らくいち)・楽座(らくざ)を 行う', people: ['nobunaga'],
    note: '安土の城下町で、だれでも自由に商売ができるようにして、商工業をさかんにしました。',
  },
  {
    id: 'honnoji', era: 'sengoku', from: 1582, when: '1582年',
    title: '本能寺(ほんのうじ)の 変', people: ['mitsuhide', 'nobunaga'],
    note: '家来の明智光秀にそむかれ、織田信長は京都の本能寺で自害しました。',
  },
  {
    id: 'kenchi', era: 'sengoku', from: 1582, when: '1582年',
    title: '太閤検地(たいこうけんち)が 始まる', people: ['hideyoshi'],
    note: '豊臣秀吉は、全国の田畑の広さや土地のよしあしを調べ、とれる米の量を石高(こくだか)で表しました。',
  },
  {
    id: 'osakajo', era: 'sengoku', from: 1583, when: '1583年',
    title: '大阪城(おおさかじょう)の 建設が 始まる', people: ['hideyoshi'],
    note: '豊臣秀吉は、石山本願寺(いしやまほんがんじ)のあとに大阪城を築き、天下統一の拠点(きょてん)にしました。',
  },
  {
    id: 'bateren', era: 'sengoku', from: 1587, when: '1587年',
    title: 'バテレン追放令(ついほうれい)が 出される', people: ['hideyoshi'],
    note: '豊臣秀吉は、キリスト教の宣教師（バテレン）を国外に追放するよう命じました。',
  },
  {
    id: 'katanagari', era: 'sengoku', from: 1588, when: '1588年',
    title: '刀狩(かたながり)令が 出される', people: ['hideyoshi'],
    note: '百姓から刀や鉄砲などの武器を取り上げ、一揆を防ぎました。検地と刀狩で、武士と百姓の身分の区別がはっきりしました（兵農分離(へいのうぶんり)）。',
  },
  {
    id: 'tenka', era: 'sengoku', from: 1590, when: '1590年',
    title: '天下統一(てんかとういつ)が なしとげられる', people: ['hideyoshi'],
    note: '豊臣秀吉は、小田原(おだわら)の北条(ほうじょう)氏をほろぼし、全国を統一しました。',
  },
  {
    id: 'chosen', era: 'sengoku', from: 1592, when: '1592年',
    title: '朝鮮(ちょうせん)に 大軍を 送る', people: ['hideyoshi'],
    note: '豊臣秀吉は、明(みん)を征服しようと、2度にわたって朝鮮に兵を送りましたが、秀吉の死によって引きあげました。',
  },
  {
    id: 'sekigahara', era: 'sengoku', from: 1600, when: '1600年',
    title: '関ヶ原(せきがはら)の 戦い', people: ['ieyasu', 'mitsunari'],
    note: '「天下分け目の戦い」といわれます。徳川家康のひきいる東軍が、石田三成らの西軍に勝ちました。',
  },

  // ---- 江戸 ----
  {
    id: 'edo-bakufu', era: 'edo', from: 1603, when: '1603年',
    title: '江戸幕府(えどばくふ)が 開かれる', people: ['ieyasu'],
    note: '徳川家康は征夷大将軍(せいいたいしょうぐん)となり、江戸に幕府を開きました。ここから約260年間、江戸時代が続きます。',
  },
  {
    id: 'osaka-no-jin', era: 'edo', from: 1615, when: '1615年',
    title: '大阪(おおさか)の 陣が 終わる', people: ['hideyori', 'ieyasu'],
    note: '徳川家康は、大阪城の豊臣秀頼をせめ、1614年の冬の陣と1615年の夏の陣で豊臣氏をほろぼしました。',
  },
  {
    id: 'buke', era: 'edo', from: 1615, when: '1615年',
    title: '武家諸法度(ぶけしょはっと)が 定められる', people: ['hidetada'],
    note: '大名が守るべききまりです。2代将軍・徳川秀忠のときに定められ、城を勝手に修理することなどが禁止されました。',
  },
  {
    id: 'sankin', era: 'edo', from: 1635, when: '1635年',
    title: '参勤交代(さんきんこうたい)が 制度になる', people: ['iemitsu'],
    note: '3代将軍・徳川家光は、武家諸法度(ぶけしょはっと)に参勤交代を加え、大名に1年おきに江戸と領地を行き来させました。',
  },
  {
    id: 'shimabara', era: 'edo', from: 1637, when: '1637年',
    title: '島原(しまばら)・天草(あまくさ)一揆(いっき)', people: ['amakusa'],
    note: 'キリスト教徒への厳しい取りしまりと重い年貢(ねんぐ)に苦しんだ人々が、天草四郎を中心に立ち上がりました。',
  },
  {
    id: 'sakoku', era: 'edo', from: 1641, when: '1641年',
    title: 'オランダ商館を 出島(でじま)に うつす（鎖国(さこく)の 完成）', people: ['iemitsu'],
    note: '貿易の相手を中国とオランダに限り、オランダ商館を長崎の出島にうつしました。',
  },
  {
    id: 'shorui', era: 'edo', from: 1685, when: '1685年',
    title: '生類憐(しょうるいあわれ)みの 令が 出される', people: ['tsunayoshi'],
    note: '5代将軍・徳川綱吉は、犬などの生き物を大切にするよう命じました。',
  },
  {
    id: 'okunohosomichi', era: 'edo', from: 1689, when: '1689年',
    title: '「奥(おく)の 細道」の 旅に 出る', people: ['basho'],
    note: '松尾芭蕉は、東北・北陸を旅して俳句をよみ、紀行文「奥の細道」を書きました。',
  },
  {
    id: 'sonezaki', era: 'edo', from: 1703, when: '1703年',
    title: '「曽根崎心中(そねざきしんじゅう)」が 上演される', people: ['chikamatsu'],
    note: '近松門左衛門は、町人のくらしを題材にした人形浄瑠璃(にんぎょうじょうるり)や歌舞伎(かぶき)の脚本(きゃくほん)を書きました。',
  },
  {
    id: 'kyoho', era: 'edo', from: 1716, when: '1716年',
    title: '享保(きょうほう)の 改革が 始まる', people: ['yoshimune'],
    note: '8代将軍・徳川吉宗は、目安箱(めやすばこ)を置いたり、公事方御定書(くじかたおさだめがき)をつくったりして、幕府の立て直しをはかりました。',
  },
  {
    id: 'tanuma', era: 'edo', from: 1772, when: '1772年',
    title: '老中(ろうじゅう)が 商業を 重んじる 政治を 始める', people: ['okitsugu'],
    note: '老中となった田沼意次は、株仲間(かぶなかま)を認めて税を取るなど、商業の力で幕府の収入をふやそうとしました。',
  },
  {
    id: 'kaitai', era: 'edo', from: 1774, when: '1774年',
    title: '「解体新書(かいたいしんしょ)」が 出版される', people: ['genpaku', 'ryotaku'],
    note: '杉田玄白や前野良沢らが、オランダ語の医学書をほん訳しました。これをきっかけに蘭学(らんがく)がさかんになりました。',
  },
  {
    id: 'kansei', era: 'edo', from: 1787, when: '1787年',
    title: '寛政(かんせい)の 改革が 始まる', people: ['sadanobu'],
    note: '老中(ろうじゅう)・松平定信は、ききんに備えて米をたくわえさせ、武士に学問をすすめるなど、きびしい倹約(けんやく)を行いました。',
  },
  {
    id: 'kojikiden', era: 'edo', from: 1798, when: '1798年',
    title: '「古事記伝(こじきでん)」が 完成する', people: ['norinaga'],
    note: '本居宣長は、35年かけて古事記を研究し、日本古来の考え方を明らかにしようとする国学(こくがく)を大成しました。',
  },
  {
    id: 'ino', era: 'edo', from: 1800, when: '1800年',
    title: '全国の 測量(そくりょう)が 始まる', people: ['ino'],
    note: '伊能忠敬は、55才から17年かけて全国を歩いて測量し、正確な日本地図をつくりました。',
  },
  {
    id: 'fugaku', era: 'edo', from: 1831, when: '1831年ごろ',
    title: '浮世絵(うきよえ)「富嶽三十六景(ふがくさんじゅうろっけい)」が 出される', people: ['hokusai'],
    note: '葛飾北斎が、さまざまな場所から見た富士山をえがいた浮世絵です。',
  },
  {
    id: 'tokaido', era: 'edo', from: 1833, when: '1833年ごろ',
    title: '浮世絵(うきよえ)「東海道五十三次(とうかいどうごじゅうさんつぎ)」が 出される', people: ['hiroshige'],
    note: '歌川広重が、東海道の宿場町(しゅくばまち)の風景をえがいた浮世絵です。',
  },
  {
    id: 'oshio', era: 'edo', from: 1837, when: '1837年',
    title: '大阪で 元役人が 反乱を 起こす', people: ['oshio'],
    note: 'ききんで苦しむ人々を救おうとしない役人に対して、元役人の大塩平八郎が大阪で反乱を起こしました。',
  },
  {
    id: 'tenpo', era: 'edo', from: 1841, when: '1841年',
    title: '天保(てんぽう)の 改革が 始まる', people: ['tadakuni'],
    note: '老中(ろうじゅう)・水野忠邦は、株仲間(かぶなかま)を解散させるなどの改革を行いましたが、反対が多く2年ほどで失敗しました。',
  },
  {
    id: 'kurofune', era: 'edo', from: 1853, when: '1853年',
    title: '黒船(くろふね)が 浦賀(うらが)に 来る', people: ['perry'],
    note: 'アメリカの使節ペリーが4せきの軍艦で浦賀に来て、開国を求めました。',
  },
  {
    id: 'washin', era: 'edo', from: 1854, when: '1854年',
    title: '日米和親(わしん)条約が 結ばれる', people: ['perry'],
    note: '下田(しもだ)と函館(はこだて)の2つの港を開き、アメリカの船に水や食料をあたえることを約束しました。',
  },
  {
    id: 'tsusho', era: 'edo', from: 1858, when: '1858年',
    title: '日米修好通商(しゅうこうつうしょう)条約が 結ばれる', people: ['naosuke', 'harris'],
    note: '大老(たいろう)の井伊直弼がアメリカのハリスと結んだ条約です。領事裁判権(りょうじさいばんけん)を認め、関税自主権(かんぜいじしゅけん)がない、日本に不利な不平等条約でした。',
  },
  {
    id: 'sakuradamon', era: 'edo', from: 1860, when: '1860年',
    title: '桜田門外(さくらだもんがい)の 変', people: ['naosuke'],
    note: '反対派を厳しく取りしまった大老(たいろう)の井伊直弼が、江戸城の桜田門の外で暗殺されました。',
  },
  {
    id: 'satcho', era: 'edo', from: 1866, when: '1866年',
    title: '薩長(さっちょう)同盟が 結ばれる', people: ['ryoma', 'saigo', 'kido'],
    note: '土佐藩(とさはん)出身の坂本龍馬の仲立ちで、薩摩藩(さつまはん)の西郷隆盛と長州藩(ちょうしゅうはん)の木戸孝允が手を結びました。',
  },
  {
    id: 'taisei', era: 'edo', from: 1867, when: '1867年',
    title: '大政奉還(たいせいほうかん)', people: ['yoshinobu'],
    note: '15代将軍・徳川慶喜が、政権を朝廷に返しました。これで江戸幕府は終わりました。',
  },

  // ---- 明治・大正 ----
  {
    id: 'gokajo', era: 'modern', from: 1868, when: '1868年',
    title: '五箇条(ごかじょう)の 御誓文(ごせいもん)が 出される', people: ['meiji'],
    note: '明治天皇が神にちかう形で、新しい政治の方針を示しました。「広く会議を開き、政治は人々の話し合いで決めよう」などと書かれています。',
  },
  {
    id: 'edojo', era: 'modern', from: 1868, when: '1868年',
    title: '江戸城が 戦わずに 明けわたされる', people: ['kaishu', 'saigo'],
    note: '幕府の勝海舟と新政府軍の西郷隆盛が話し合い、江戸の町を戦火から守りました。',
  },
  {
    id: 'haihan', era: 'modern', from: 1871, when: '1871年',
    title: '廃藩置県(はいはんちけん)が 行われる', people: ['okubo', 'kido'],
    note: '藩を廃止して県を置き、政府が任命した役人に治めさせました。全国を政府が直接治めるようになりました。',
  },
  {
    id: 'iwakura', era: 'modern', from: 1871, when: '1871年',
    title: '使節団(しせつだん)が 欧米(おうべい)に 送られる', people: ['iwakura', 'umeko'],
    note: '岩倉具視を代表とする使節団が、約2年かけて欧米を視察しました。津田梅子は6才で留学し、のちに女子英学塾（今の津田塾大学）をつくりました。',
  },
  {
    id: 'gakumon', era: 'modern', from: 1872, when: '1872年',
    title: '「学問(がくもん)の すゝめ」が 出版される', people: ['yukichi'],
    note: '福沢諭吉は「天は人の上に人をつくらず…」と、人は生まれながらに平等であること、学問の大切さを説きました。',
  },
  {
    id: 'tomioka', era: 'modern', from: 1872, when: '1872年',
    title: '富岡製糸場(とみおかせいしじょう)が 開業する', people: ['shibusawa'],
    note: '群馬県につくられた官営工場です。フランスの技術を取り入れ、生糸(きいと)をつくりました。渋沢栄一は設立にかかわり、のちに多くの会社をつくりました。',
  },
  {
    id: 'chiso', era: 'modern', from: 1873, when: '1873年',
    title: '地租改正(ちそかいせい)が 始まる', people: [],
    note: '土地の値段（地価）の3%を、お金で納めさせるようにしました。国の収入が安定しました。',
  },
  {
    id: 'seinan', era: 'modern', from: 1877, when: '1877年',
    title: '西南(せいなん)戦争', people: ['saigo'],
    note: '新政府に不満をもつ士族(しぞく)が、西郷隆盛を中心に鹿児島で反乱を起こしました。最後の士族の反乱です。',
  },
  {
    id: 'kokkai-choku', era: 'modern', from: 1881, when: '1881年',
    title: '10年後に 国会を 開くと 約束される', people: ['itagaki'],
    note: '自由民権運動の高まりを受けて、政府は国会を開くことを約束しました。板垣退助は自由党をつくりました。',
  },
  {
    id: 'kaishinto', era: 'modern', from: 1882, when: '1882年',
    title: '立憲改進党(りっけんかいしんとう)が つくられる', people: ['okuma'],
    note: '大隈重信がつくった政党です。大隈重信は、東京専門学校（今の早稲田(わせだ)大学）もつくりました。',
  },
  {
    id: 'naikaku', era: 'modern', from: 1885, when: '1885年',
    title: '内閣(ないかく)制度が できる', people: ['ito'],
    note: '伊藤博文が初代の内閣総理大臣になりました。',
  },
  {
    id: 'kenpo-meiji', era: 'modern', from: 1889, when: '1889年',
    title: '大日本帝国(だいにっぽんていこく)憲法が 発布される', people: ['ito'],
    note: '伊藤博文らが、ドイツの憲法を参考につくりました。天皇が主権をもつ憲法です。',
  },
  {
    id: 'gikai', era: 'modern', from: 1890, when: '1890年',
    title: '第1回 帝国議会(ていこくぎかい)が 開かれる', people: [],
    note: '衆議院と貴族院の二院制でした。衆議院議員の選挙権は、一定の税金を納めた25才以上の男子だけにありました。',
  },
  {
    id: 'ryoji', era: 'modern', from: 1894, when: '1894年',
    title: '領事裁判権(りょうじさいばんけん)を なくす', people: ['mutsu'],
    note: '外務大臣の陸奥宗光は、イギリスと交渉して、領事裁判権（治外法権(ちがいほうけん)）をなくすことに成功しました。',
  },
  {
    id: 'nisshin', era: 'modern', from: 1894, when: '1894年',
    title: '日清(にっしん)戦争が 始まる', people: [],
    note: '朝鮮をめぐって、日本と清（中国）が戦いました。日本が勝ちました。',
  },
  {
    id: 'shimonoseki', era: 'modern', from: 1895, when: '1895年',
    title: '下関(しものせき)条約が 結ばれる', people: ['ito', 'mutsu'],
    note: '日清戦争の講和条約です。日本は清から台湾(たいわん)などの領土と多額の賠償金(ばいしょうきん)を得ました。',
  },
  {
    id: 'ashio', era: 'modern', from: 1901, when: '1901年',
    title: '鉱毒(こうどく)問題を 天皇に 直訴(じきそ)する', people: ['shozo'],
    note: '栃木県の足尾銅山(あしおどうざん)から出た鉱毒が川をよごし、農民が苦しみました。田中正造は議員をやめて、天皇に直訴しようとしました。',
  },
  {
    id: 'nichiei', era: 'modern', from: 1902, when: '1902年',
    title: '日英(にちえい)同盟が 結ばれる', people: [],
    note: 'ロシアの南下に備えて、日本とイギリスが同盟を結びました。',
  },
  {
    id: 'nichiro', era: 'modern', from: 1904, when: '1904年',
    title: '日露(にちろ)戦争が 始まる', people: ['togo', 'akiko'],
    note: '東郷平八郎のひきいる艦隊(かんたい)が、日本海海戦でロシアの艦隊をやぶりました。与謝野晶子は、戦場の弟を思って「君死にたまふことなかれ」という詩を発表しました。',
  },
  {
    id: 'portsmouth', era: 'modern', from: 1905, when: '1905年',
    title: 'ポーツマス条約が 結ばれる', people: ['komura'],
    note: 'アメリカの仲立ちで結ばれた日露戦争の講和条約です。外務大臣の小村寿太郎が交渉しましたが、賠償金(ばいしょうきん)は得られませんでした。',
  },
  {
    id: 'heigo', era: 'modern', from: 1910, when: '1910年',
    title: '韓国(かんこく)併合(へいごう)', people: [],
    note: '日本は韓国を併合して植民地にしました。朝鮮の人々は、日本語の教育などをおしつけられました。',
  },
  {
    id: 'kanzei', era: 'modern', from: 1911, when: '1911年',
    title: '関税自主権(かんぜいじしゅけん)を 回復する', people: ['komura'],
    note: '外務大臣の小村寿太郎がアメリカと交渉し、関税自主権を取りもどしました。これで不平等条約の改正が完了しました。',
  },
  {
    id: 'seito', era: 'modern', from: 1911, when: '1911年',
    title: '女性の 雑誌「青鞜(せいとう)」が 発刊される', people: ['raicho'],
    note: '平塚らいてうは「元始(げんし)、女性は実に太陽であった」と書き、女性の地位向上をうったえました。',
  },
  {
    id: 'ww1', era: 'modern', from: 1914, when: '1914年',
    title: '第一次世界大戦が 始まる', people: [],
    note: 'ヨーロッパを中心に起こった戦争です。日本は日英同盟を理由に参戦しました。',
  },
  {
    id: 'kome', era: 'modern', from: 1918, when: '1918年',
    title: '米の 値上がりで、富山県から 全国に 米騒動(こめそうどう)が 広がる', people: [],
    note: 'シベリア出兵を見こした米の買いしめで米の値段が急に上がり、富山県の漁村の女性たちが米の安売りを求めたことから、全国に広がりました。軍隊が出動するほどの騒ぎになり、内閣がたおれました。',
  },
  {
    id: 'hara', era: 'modern', from: 1918, when: '1918年',
    title: '本格的な 政党内閣(せいとうないかく)が できる', people: ['hara'],
    note: '米騒動のあと、原敬が首相となり、大臣のほとんどを政党の党員でしめる内閣をつくりました。',
  },
  {
    id: 'renmei', era: 'modern', from: 1920, when: '1920年',
    title: '国際連盟(こくさいれんめい)が つくられる', people: ['nitobe'],
    note: '第一次世界大戦の反省から、世界平和を守るためにつくられました。新渡戸稲造は事務局次長として活やくしました。',
  },
  {
    id: 'suiheisha', era: 'modern', from: 1922, when: '1922年',
    title: '全国水平社(すいへいしゃ)が つくられる', people: ['saiko'],
    note: '差別に苦しんできた人々が、差別をなくすために立ち上がりました。西光万吉らが水平社宣言を書きました。',
  },
  {
    id: 'kanto', era: 'modern', from: 1923, when: '1923年',
    title: '関東大震災(かんとうだいしんさい)が 起こる', people: [],
    note: '9月1日、関東地方を大地震がおそい、火災などで10万人以上がなくなりました。9月1日は「防災(ぼうさい)の日」です。',
  },
  {
    id: 'futsu', era: 'modern', from: 1925, when: '1925年',
    title: '普通選挙法(ふつうせんきょほう)が 成立する', people: ['kato-takaaki'],
    note: '加藤高明内閣のときに成立し、25才以上のすべての男子に選挙権があたえられました。同じ年に治安維持法(ちあんいじほう)もつくられました。',
  },

  // ---- 昭和〜現代 ----
  {
    id: 'noguchi', era: 'showa', from: 1928, when: '1928年',
    title: '黄熱病(おうねつびょう)の 研究中に アフリカで なくなる', people: ['noguchi'],
    note: '野口英世は、細菌学者としてアメリカなどで研究し、アフリカで黄熱病の研究中に、自らも感染してなくなりました。',
  },
  {
    id: 'manshu', era: 'showa', from: 1931, when: '1931年',
    title: '満州事変(まんしゅうじへん)が 起こる', people: [],
    note: '日本軍が南満州鉄道の線路を爆破し、それを中国軍のしわざとして軍事行動を始めました。翌年、満州国がつくられました。',
  },
  {
    id: 'go-ichigo', era: 'showa', from: 1932, when: '1932年',
    title: '五・一五事件', people: ['inukai'],
    note: '海軍の青年将校(しょうこう)らが首相官邸(かんてい)をおそい、犬養毅首相を暗殺しました。これで政党内閣が終わりました。',
  },
  {
    id: 'dattai', era: 'showa', from: 1933, when: '1933年',
    title: '国際連盟(こくさいれんめい)を 脱退(だったい)する', people: ['matsuoka'],
    note: '国際連盟が満州国を認めなかったため、日本代表の松岡洋右は会議場から退場し、日本は国際連盟を脱退しました。',
  },
  {
    id: 'ni-niroku', era: 'showa', from: 1936, when: '1936年',
    title: '二・二六事件', people: ['takahashi'],
    note: '陸軍の青年将校(しょうこう)らが東京の中心部を占拠(せんきょ)し、大蔵大臣の高橋是清らを暗殺しました。このあと軍部の力がさらに強まりました。',
  },
  {
    id: 'nicchu', era: 'showa', from: 1937, when: '1937年',
    title: '日中戦争が 始まる', people: ['konoe'],
    note: '北京（ペキン）の近くの盧溝橋(ろこうきょう)での衝突(しょうとつ)をきっかけに、中国との全面的な戦争が始まりました。そのときの首相は近衛文麿です。',
  },
  {
    id: 'taiheiyo', era: 'showa', from: 1941, when: '1941年',
    title: '太平洋戦争が 始まる', people: ['tojo'],
    note: '12月8日、日本軍がハワイの真珠湾(しんじゅわん)とマレー半島をこうげきし、アメリカやイギリスとの戦争が始まりました。首相は東条英機でした。',
  },
  {
    id: 'shusen', era: 'showa', from: 1945, when: '1945年',
    title: '原子爆弾(げんしばくだん)が 落とされ、戦争が 終わる', people: [],
    note: '8月6日に広島、8月9日に長崎に原子爆弾が落とされました。日本はポツダム宣言を受け入れて降伏(こうふく)し、8月15日に天皇がラジオで国民に伝えました。',
  },
  {
    id: 'kenpo', era: 'showa', from: 1946, when: '1946年',
    title: '日本国憲法が 公布(こうふ)される', people: ['macarthur'],
    note: '11月3日に公布、1947年5月3日に施行(しこう)されました。マッカーサーのひきいるGHQ（連合国軍総司令部）の案をもとにつくられました。国民主権・基本的人権の尊重・平和主義が3つの原則です。',
  },
  {
    id: 'yukawa', era: 'showa', from: 1949, when: '1949年',
    title: '日本人 初の ノーベル賞', people: ['yukawa'],
    note: '物理学者の湯川秀樹が、中間子(ちゅうかんし)の理論でノーベル物理学賞を受賞し、戦後の日本の人々を勇気づけました。',
  },
  {
    id: 'sanfrancisco', era: 'showa', from: 1951, when: '1951年',
    title: 'サンフランシスコ平和条約が 結ばれる', people: ['yoshida'],
    note: '吉田茂首相が48か国と平和条約を結び、翌年、日本は独立を回復しました。同じ日に日米安全保障条約も結ばれました。',
  },
  {
    id: 'kokuren', era: 'showa', from: 1956, when: '1956年',
    title: '国際連合に 加盟(かめい)する', people: ['hatoyama'],
    note: '鳩山一郎首相がソ連と日ソ共同宣言を結んで国交を回復し、日本は国際連合への加盟が認められました。',
  },
  {
    id: 'olympic', era: 'showa', from: 1964, when: '1964年',
    title: '東京オリンピックが 開かれる', people: [],
    note: 'アジアで初めてのオリンピックです。開会式の直前に東海道新幹線が開業しました。高度経済成長の時代でした。',
  },
  {
    id: 'kawabata', era: 'showa', from: 1968, when: '1968年',
    title: '日本人 初の ノーベル文学賞', people: ['kawabata'],
    note: '「雪国」「伊豆(いず)の踊子(おどりこ)」などを書いた川端康成が受賞しました。',
  },
  {
    id: 'banpaku', era: 'showa', from: 1970, when: '1970年',
    title: '大阪で 万国博覧会(ばんこくはくらんかい)が 開かれる', people: ['okamoto'],
    note: 'アジアで初めての万国博覧会で、6400万人以上が訪れました。岡本太郎がつくった「太陽の塔」がシンボルでした。',
  },
  {
    id: 'okinawa', era: 'showa', from: 1972, when: '1972年',
    title: '沖縄(おきなわ)が 日本に 返還(へんかん)される', people: ['sato'],
    note: '戦後、アメリカに統治されていた沖縄が、佐藤栄作首相のときに日本に返されました。今も多くのアメリカ軍基地が残っています。',
  },
  {
    id: 'nicchu-kokko', era: 'showa', from: 1972, when: '1972年',
    title: '中国との 国交が 正常化する', people: ['tanaka-kakuei'],
    note: '田中角栄首相が中国を訪れ、日中共同声明を出して国交を正常化しました。このあと中国からパンダがおくられました。',
  },
  {
    id: 'hanshin', era: 'showa', from: 1995, when: '1995年',
    title: '阪神(はんしん)・淡路大震災(あわじだいしんさい)が 起こる', people: [],
    note: '1月17日、兵庫県南部を大地震がおそい、6400人以上がなくなりました。多くのボランティアが活動し、「ボランティア元年」とよばれました。',
  },
  {
    id: 'higashinihon', era: 'showa', from: 2011, when: '2011年',
    title: '東日本大震災(ひがしにほんだいしんさい)が 起こる', people: [],
    note: '3月11日、東北地方の太平洋沖で大地震が起こり、大きな津波(つなみ)がおそいました。福島第一原子力発電所の事故も起こりました。',
  },
];

const BY_ID = new Map(EVENTS.map((e) => [e.id, e]));

export function eventById(id: string): HistEvent | undefined {
  return BY_ID.get(id);
}
