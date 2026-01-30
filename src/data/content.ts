import type { ImageMetadata } from 'astro';
import Cocos2dxIcon from '@/images/Cocos2dx_Icon.png';
import CPlusPlusIcon from '@/images/CPlusPlus_Icon.png';
import CSharpIcon from '@/images/CSharp_Icon.png';
import CysharpIcon from '@/images/Cysharp_Icon.png';
import CrossHeader from '@/images/Cross_the_C_Header.png';
import DeeperHeader from '@/images/Deeper_and_Deeper_Header.png';
import ElegoHeader from '@/images/ELEGO_Header.png';
import NiHeader from '@/images/Ni_Header.png';
import OrbitHeader from '@/images/Orbit_Header.png';
import PythonIcon from '@/images/Python_Icon.png';
import QueenBeeHeader from '@/images/QueenBee_Header.png';
import UnityIcon from '@/images/Unity_Icon.png';
import VariVaRevengeHeader from '@/images/VariVaRevenge_Header.png';
import VContainerIcon from '@/images/VContainer_Icon.png';

export type CareerItem = {
  company: string;
  period: string;
  details: string[];
  tech?: string[];
  url?: string;
};

export type HobbyLink = {
  label: string;
  url: string;
};

export type HobbyItem = {
  name: string;
  icon: string;
  details: string[];
  favoritesLabel?: string;
  favorites?: HobbyLink[];
};

export type SkillItem = {
  name: string;
  icon: ImageMetadata;
  level: number;
  description: string;
};

export type ProjectLink = {
  label: string;
  url: string;
};

export type ProjectGenre = 'ゲーム' | '謎解き';

export type ProjectItem = {
  title: string;
  period: string;
  tech: string[];
  member: string;
  outline: string;
  appeal: string;
  genre: ProjectGenre;
  playLink?: ProjectLink;
  relatedLinks?: ProjectLink[];
  headerImage?: ImageMetadata;
  awards?: string[];
};

export type ProjectYearGroup = {
  year: string;
  items: ProjectItem[];
};

export const LABELS = {
  play: 'プレイリンク',
  related: '関連記事',
  twitter: 'Twitter',
  github: 'GitHub',
  ticket: 'チケットサイト',
} as const;

const TECH = {
  unity: 'Unity',
  unityUrp: 'Unity URP',
  git: 'Git',
  vcontainer: 'VContainer',
  unitask: 'UniTask',
  unirx: 'UniRx',
  r3: 'R3',
  feel: 'FEEL',
  udon: 'Udon#',
  vrchat: 'VRChat',
  pun2: 'PUN2',
  reEngine: 'RE ENGINE',
  cocos2dx: 'Cocos-2dx',
  cPlusPlus: 'C++',
  cSharp: 'C#',
} as const;

const GENRE = {
  game: 'ゲーム',
  riddle: '謎解き',
} as const;

export const PROFILE = {
  name: 'どぐえぐ',
  title: 'どぐえぐ',
  tagline: 'ゲームを作るのが好きです',
  affiliation: '東京科学大学 情報理工学院 数理・計算科学系 学士3年',
  clubs: '東京科学大学デジタル創作同好会traP / C-lock-row',
  sections: {
    abaoutMeTitle: 'About Me',
    worksTitle: 'Products',
    worksLead: 'これまでに制作したもの',
    skillsTitle: 'Skills',
    careerTitle: 'Career',
    careerLead: '経歴など',
    hobbyTitle: 'Hobbies',
    hobbyLead: '趣味・好きなこと',
  },
  footer: '© 2026 @dogegg. All rights reserved.',
  iconAlt: 'どぐえぐのアイコン',
} as const;

export const NAV_SECTIONS = [
  { id: 'top', label: PROFILE.sections.abaoutMeTitle },
  { id: 'skills', label: PROFILE.sections.skillsTitle },
  { id: 'works', label: PROFILE.sections.worksTitle },
  { id: 'career', label: PROFILE.sections.careerTitle },
  { id: 'hobby', label: PROFILE.sections.hobbyTitle },
] as const;

export const CAREERS: CareerItem[] = [
  {
    company: 'C-lock-row',
    period: '2025年7月~現在',
    details: ['最近謎解き制作の方を始めました。'],
    url: 'https://x.com/C_lock_row',
    tech: [],
  },
  {
    company: 'GREE Jobs',
    period: '2025年2月~3月',
    details: [
      '1ヶ月のインターンに参加しました。ソーシャルゲームの新機能実装について、プランナーとの仕様決定から実装、QAとのやり取りまでの一通りの業務を行いました。',
    ],
    url: 'https://hd.gree.net/jp/ja/recruit/internship/jobs/',
    tech: [TECH.cocos2dx, TECH.cPlusPlus],
  },
  {
    company: 'Game Speed Hackathon Autumn 2024',
    period: '2024年9月',
    details: ['ゲームの実装速度を競うイベントです。優勝することができました。'],
    url: 'https://cyberagent.snar.jp/jobboard/detail.aspx?id=ohkV1eN5MKVBUTT67mLh3g',
    tech: [TECH.unity, TECH.cSharp],
  },
  {
    company: 'CA Tech Job',
    period: '2024年9月',
    details: [
      '1ヶ月のインターンに参加しました。ソーシャルゲームのゲームクライアントのパフォーマンスチューニングに取り組みました。',
    ],
    url: 'https://www.cyberagent.co.jp/careers/students/event/detail/id=32004',
    tech: [TECH.unity, TECH.cSharp, TECH.git],
  },
  {
    company: 'コーエーテクモゲームエンジン開発インターンシップ',
    period: '2024年8月~9月',
    details: ['2週間でゲームエンジンの一機能について実装しました。'],
    url: 'https://job.tracks.run/internship/koeitecmoholdings-26-01',
    tech: [TECH.cPlusPlus],
  },
  {
    company: '東京科学大学デジタル創作同好会traP',
    period: '2022年4月~現在',
    details: [
      '大学入学当初から加入しています。',
      '普段はここでゲーム制作をしています。',
      'ゲーム班長や渉外担当としても活動していましたが、既に後輩に引き継いでいます。',
    ],
    url: 'https://trap.jp',
    tech: [TECH.unity, TECH.cSharp, TECH.git, TECH.vcontainer, TECH.unitask, TECH.r3, TECH.cPlusPlus],
  },
];

export const HOBBIES: HobbyItem[] = [
  {
    name: '謎解き',
    icon: '🔍',
    details: ['タンブルウィードによく行きます'],
    favoritesLabel: '好きな謎解き公演',
    favorites: [
      { label: '未完', url: 'https://tumbleweed.jp/event/mikan' },
      { label: 'ROLE', url: 'https://tumbleweed.jp/event/role/' },
      { label: 'ここから先は自分の力で考えましょう。', url: 'https://www.xeoxy.com/event/ksk' },
    ],
  },
  {
    name: '漫画',
    icon: '📚',
    details: ['ジャンプラ購読してます'],
    favoritesLabel: '好きな漫画',
    favorites: [
      { label: '亜人', url: 'https://pocket.shonenmagazine.com/title/01458/episode/324202' },
      { label: '嘘喰い', url: 'https://ynjn.jp/title/129' },
      { label: '宇宙兄弟', url: 'https://sbyomu.lp.koyamachuya.com/' },
    ],
  },
  {
    name: 'ゲーム(遊ぶ方)',
    icon: '🎮',
    details: ['AAAタイトルよりインディーゲームの方をよく遊びます'],
    favoritesLabel: '好きなゲーム',
    favorites: [
      { label: 'The Witness', url: 'https://store.steampowered.com/app/210970/The_Witness/' },
      { label: 'Outer Wilds', url: 'https://store.steampowered.com/app/753640/Outer_Wilds/' },
      { label: 'パクレットのうさちゃん捕獲ゲーム', url: 'https://store.steampowered.com/app/1628610/_/' },
      { label: 'Stray', url: 'https://store.steampowered.com/app/1332010/Stray/' },
    ],
  },
  {
    name: 'ゲーム(つくる方)',
    icon: '🛠️',
    details: ['Unity, C#を使います'],
  },
];

export const SKILLS: SkillItem[] = [
  {
    name: 'Unity',
    icon: UnityIcon,
    level: 3,
    description: '普段のゲーム制作はUnityを使っています。',
  },
  {
    name: 'UniTask',
    icon: CysharpIcon,
    level: 3,
    description: '普段から非同期処理やゲームフロー作成に使用しています。',
  },
  {
    name: 'R3',
    icon: CysharpIcon,
    level: 3,
    description: 'View部分とModel部分の同期によく仕様しています。',
  },
  {
    name: 'C#',
    icon: CSharpIcon,
    level: 3,
    description: 'Unityを使う時に書いています。',
  },
  {
    name: 'VContainer',
    icon: VContainerIcon,
    level: 2,
    description: 'DIコンテナとして普段から使っています。',
  },
  {
    name: 'C++',
    icon: CPlusPlusIcon,
    level: 2,
    description: '競プロで普段使っています。インターンでCocos-2dx使用時に書いたことがあります。',
  },
  {
    name: 'Python',
    icon: PythonIcon,
    level: 2,
    description: '競プロで使っていました。軽いアプリ作成で使います。',
  },
  {
    name: 'Cocos-2dx',
    icon: Cocos2dxIcon,
    level: 1,
    description: 'インターンで1ヶ月ほど使用しました。',
  },
];

export const PROJECTS: ProjectYearGroup[] = [
  {
    year: '2025',
    items: [
      {
        title: 'ELEGO',
        period: '2025年4月～9月 (6か月)',
        tech: [TECH.reEngine],
        member: 'プランナー5人, プログラマー5人, 3Dデザイナー4人, 2Dデザイナー2人, シナリオ1人, サウンド2人',
        outline: '敵を操って脱出を目指すステルスアクションゲーム',
        appeal: 'CAPCOM GAMES COMPETITIONというイベントで制作しました。ディレクター兼マネージャーとして経験者のメンバー19人をまとめ、企画～完成までを担当しました。未知のエンジン・6か月で完全締め切り・3Dアクション制作未経験という状況ながら、なんとか完成まで持っていきました。',
        genre: GENRE.game,
        playLink: { label: LABELS.play, url: 'https://gameparade.creators-guild.com/works/3532' },
        relatedLinks: [{ label: LABELS.related, url: 'https://www.capcom-games.com/cgc/2025/ja-jp/' }],
        headerImage: ElegoHeader,
        awards: ['ゲームクエイター甲子園2025セミファイナリスト'],
      },
      {
        title: '2',
        period: '',
        tech: [],
        member: '',
        outline: '',
        appeal: '全体構成・当日スタッフに関わりました。',
        genre: GENRE.riddle,
        playLink: { label: LABELS.ticket, url: 'https://escape.id/Clockrow-org/e-url-wo-atenaidene22222/' },
        headerImage: NiHeader,
      },
      {
        title: 'Deeper and Deeper',
        period: '2025年12月 (準備1週間, 制作1週間)',
        tech: [TECH.unity, TECH.git, TECH.vcontainer, TECH.unitask],
        member: 'プランナー1人, プログラマー3人, 2Dデザイナー3人, サウンド1人',
        outline: 'ダンジョンの深く深くに進みお宝を手に入れて帰還するゲーム',
        appeal: 'リードプログラマとしてほぼ全てのプログラムを書きました。',
        genre: GENRE.game,
        playLink: { label: LABELS.play, url: 'https://unityroom.com/games/deeper_and_deeper?ref=trap.jp' },
        relatedLinks: [{ label: LABELS.related, url: 'https://trap.jp/post/2798/' }],
        headerImage: DeeperHeader,
      },
    ],
  },
  {
    year: '2024',
    items: [
      {
        title: 'Cross the C',
        period: '2024年7月～現在 (約1年半)',
        tech: [TECH.unityUrp, TECH.git, TECH.r3, TECH.unitask, TECH.vcontainer],
        member: 'プランナー4人, プログラマー3人, 3Dデザイナー3人, 2Dデザイナー1人, パズル制作7人',
        outline: '船を操作してゴールを目指す氷床パズルゲーム',
        appeal: 'リーダー・リードプログラマとして参加しています',
        genre: GENRE.game,
        playLink: { label: LABELS.play, url: 'https://gameparade.creators-guild.com/works/2763' },
        relatedLinks: [{ label: '関連リンク', url: 'https://store.steampowered.com/app/3382690/Cross_the_C/' }],
        headerImage: CrossHeader,
        awards: ['ゲームクリエイター甲子園2024総合大賞ノミネート', 'ゲームクリエイター甲子園2025総合大賞ノミネート'],
      },
      {
        title: 'Queen Bee',
        period: '2025年1月 (準備1週間, 制作1週間)',
        tech: [TECH.unity, TECH.git, TECH.unitask],
        member: 'プランナー1人, プログラマー3人, 2Dデザイナー2人, サウンド1人',
        outline: '主人公・野心萌(やしん もえ)が学園トップを目指す学園シミュレーションカードゲーム',
        appeal: 'リーダー兼リードプログラマとして制作しました。同じ学年で対等なメンバーが多く、白熱した企画議論ができましたが、あまりまとまりませんでした。拙いながらも仕様決定をし、メンバーに指示出しをしながら最後までプログラムを書きました。',
        genre: GENRE.game,
        playLink: { label: LABELS.play, url: 'https://unityroom.com/games/queenbee' },
        relatedLinks: [{ label: LABELS.related, url: 'https://trap.jp/post/2483/' }],
        headerImage: QueenBeeHeader,
      },
    ],
  },
  {
    year: '2023',
    items: [
      {
        title: '「」か？',
        period: '2023年6月 (準備1週間, 制作2日)',
        tech: [TECH.unity, TECH.git],
        member: 'プログラマー3人, 2Dデザイナー2人',
        outline: 'ひらがなを吸収して変身して戦う2D弾幕アクションゲーム',
        appeal: 'プログラマ兼チームリーダーとして、新入生への講習やサポート・レビューなどを行いながら、2日で完成させられるゲーム性の考案やプログラム制作を行いました。',
        genre: GENRE.game,
        playLink: { label: LABELS.play, url: 'https://trap.jp/post/1911/' },
        relatedLinks: [{ label: LABELS.related, url: 'https://trap.jp/post/1911/' }],
      },
      {
        title: 'Memory Transer',
        period: '2023年5月～7月 (約2か月)',
        tech: [TECH.unity, TECH.git, TECH.unirx, TECH.unitask],
        member: 'プランナー4人, プログラマー4人, 2Dデザイナー1人',
        outline: '記憶を整理するアクションゲーム',
        appeal: 'リードエンジニアとして立候補し、他メンバーへのGitやコードエディター(Rider)の講習を行い、設計からタスクの割り振りまで行いました。途中からメンバーの脱落があり、急遽集会を開くなどして完成まで持っていきました。',
        genre: GENRE.game,
        playLink: { label: LABELS.play, url: 'https://bitsummit-gamejam.itch.io/memorytranser' },
      },
      {
        title: 'バリバリベンジ',
        period: '2023年7月～現在 (約2年半)',
        tech: [TECH.unity, TECH.git, TECH.r3, TECH.unitask, TECH.feel],
        member: 'プランナー3人, プログラマー5人, 2Dデザイナー2人, サウンド2人, 弾幕制作2人',
        outline: '敵の出してくる弾をかいくぐり敵に直接アタックする弾幕ゲー×2Dアクションの新感覚ゲーム！',
        appeal: '企画者に誘われ、リードプログラマとして技術的な面でメンバーを引っ張りました。プログラマでない人も敵の制作ができるようにエディター拡張に特に力を入れました。',
        genre: GENRE.game,
        playLink: { label: LABELS.play, url: 'https://gameparade.creators-guild.com/works/1559' },
        relatedLinks: [{ label: LABELS.related, url: 'https://trap.jp/post/1971/' }],
        headerImage: VariVaRevengeHeader,
        awards: ['ゲームクリエイター甲子園2024総合大賞ノミネート', 'Game^3 19th 優秀賞'],
      },
      {
        title: 'Orbit',
        period: '2023年12月 (準備1週間, 制作1週間)',
        tech: [TECH.unityUrp, TECH.git, TECH.unirx, TECH.unitask],
        member: 'プランナー1人, プログラマー3人, 2Dデザイナー3人, サウンド1人',
        outline: '星を回りながらその秘密を探るリソース管理アドベンチャー',
        appeal: 'メインプログラマとしてコードやGitの規約を定め、協力して設計とゲームの実装を行いました。英語版対応をしてSteamで配信しています。',
        genre: GENRE.game,
        playLink: { label: LABELS.play, url: 'https://store.steampowered.com/app/2990710/Orbit/?ref=trap.jp' },
        relatedLinks: [{ label: LABELS.related, url: 'https://trap.jp/post/2106/' }],
        headerImage: OrbitHeader,
        awards: ['部内冬ハッカソン23 最優秀賞'],
      },
    ],
  },
  {
    year: '2022',
    items: [
      {
        title: 'つかまらないで！ゆうちゃん',
        period: '2022年6月 (準備1週間, 制作1週間)',
        tech: [TECH.unity, TECH.git],
        member: 'プログラマ4人, 2Dデザイナー1人',
        outline: '目玉に見つからないように主人公のゆうちゃんを操作してゴールを目指すアクションゲーム',
        appeal: '初心者枠として参加し、先輩の助けを借りながらプログラムを軽く書き、ゲームの仕様考案とステージ制作を主に行いました。',
        genre: GENRE.game,
        playLink: { label: LABELS.play, url: 'https://trap.jp/post/1607/' },
        relatedLinks: [{ label: LABELS.related, url: 'https://trap.jp/post/1607/' }],
        awards: ['春ハッカソン22 Emoine賞'],
      },
      {
        title: 'Logical Room',
        period: '2022年7月～2023年11月 (1年5か月)',
        tech: [TECH.unity, TECH.git],
        member: 'プログラマー8人, 2Dデザイナー1人',
        outline: '単純なルールが複雑に絡み合う2Dパズルアクションゲーム',
        appeal: 'プログラマとして参加し、プレイヤー挙動やゲームシステムなどのバグ修正・新規実装・リファクター・改良などを行いました。',
        genre: GENRE.game,
        playLink: { label: LABELS.play, url: 'https://trap.jp/post/2037/' },
        relatedLinks: [{ label: LABELS.related, url: 'https://trap.jp/post/2037/' }],
      },
      {
        title: 'School Breakin` Tag',
        period: '2022年11月～2023年11月 (1年)',
        tech: [TECH.unity, TECH.git, TECH.udon, TECH.vrchat],
        member: 'プログラマー5人, 3Dデザイナー3人',
        outline: '学校を舞台に地形を破壊できる爆弾を使って逃げ回るVRおにごっこ',
        appeal: 'プロジェクト経験のあるプログラマとして初めは参加しました。しかし途中からリーダーがキャパオーバーしてしまい、サブリーダーとして制作を進行しました。他メンバーのGit周りのサポートやタスクのマネジメントなどを行いました。',
        genre: GENRE.game,
        playLink: {
          label: LABELS.play,
          url: 'https://vrchat.com/home/launch?worldId=wrld_5fddc89d-6c2f-4208-8873-038ea25f80c5&instanceType=friend+',
        },
        relatedLinks: [{ label: LABELS.related, url: 'https://trap.jp/post/2026/' }],
        awards: ['IVRC2024メタバース部門 Unity賞'],
      },
      {
        title: 'Root Shooter',
        period: '2022年12月 (準備1週間, 制作1週間)',
        tech: [TECH.unity, TECH.git, TECH.pun2],
        member: 'プログラマー3人, 2Dデザイナー1人, サウンド1人',
        outline: '野菜を育てて撃って戦う2D対戦アクションゲームです。',
        appeal: 'プロジェクト経験のあるプログラマとしてゲームの実装を行いました。',
        genre: GENRE.game,
        playLink: { label: LABELS.play, url: 'https://trap.jp/post/1746/' },
        relatedLinks: [{ label: LABELS.related, url: 'https://trap.jp/post/1746/' }],
        awards: ['部内冬ハッカソン22 優秀賞'],
      },
    ],
  },
];
