import type { ImageMetadata } from 'astro';
import Cocos2dxIcon from '@/images/Cocos2dx_Icon.png';
import CPlusPlusIcon from '@/images/CPlusPlus_Icon.png';
import CSharpIcon from '@/images/CSharp_Icon.png';
import CysharpIcon from '@/images/Cysharp_Icon.png';
import CrossHeader from '@/images/Cross_the_C_Header.png';
import DeeperHeader from '@/images/Deeper_and_Deeper_Header.png';
import ElegoHeader from '@/images/ELEGO_Header.png';
import GitIcon from '@/images/Git_Icon.svg';
import NiHeader from '@/images/Ni_Header.png';
import OrbitHeader from '@/images/Orbit_Header.png';
import PerforceIcon from '@/images/Perforce_Icon.svg';
import PythonIcon from '@/images/Python_Icon.png';
import QueenBeeHeader from '@/images/QueenBee_Header.png';
import SvnIcon from '@/images/SVN_Icon.svg';
import UnityIcon from '@/images/Unity_Icon.png';
import VariVaRevengeHeader from '@/images/VariVaRevenge_Header.png';
import VContainerIcon from '@/images/VContainer_Icon.png';
import BlenderIcon from '@/images/Blender_Icon.png';
import FigmaIcon from '@/images/Figma_Icon.png';
import PUN2Icon from '@/images/PUN2_Icon.jpg';
import UdonSharpIcon from '@/images/UdonSharp_Icon.png';
import DaVinciResolveIcon from '@/images/DaVinci_Resolve_Icon.png';
import DogeggIcon from '@/images/dogegg_icon.png';

export type CareerItem = {
  company: string;
  period: string;
  startDate: string;
  endDate: string | null;
  representativeDate: string;
  detailMarkdown?: string;
  details: string[];
  category: 'サークル' | 'インターン' | 'イベント';
  tech?: string[];
  url?: string;
};

export type HobbyLink = {
  label: string;
  url: string;
  note?: string;
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
  icon?: ImageMetadata; 
  level: number;
  description: string;
};

export type ProjectLink = {
  label: string;
  url: string;
};

export type ProjectItem = {
  title: string;
  period: string;
  tech: string[];
  member: string;
  outline: string;
  genre: string;
  detailMarkdown?: string;
  xUrl?: string;
  githubUrl?: string;
  steamUrl?: string;
  playLink?: ProjectLink;
  relatedLinks?: ProjectLink[];
  headerImage?: ImageMetadata;
  awards?: string[];
};

export type ProjectYearGroup = {
  year: string;
  items: ProjectItem[];
};

export type ArticleItem = {
  title?: string;
  date: string;
  url: string;
}

export type AboutSocialLink = {
  label: string;
  handle: string;
  url: string;
  icon: 'x' | 'github' | 'unityroom';
};

export type AboutSection = {
  title: string;
  paragraphs?: string[];
  email?: string;
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
  unityUrp: 'URP',
  git: 'Git',
  perforce: 'Perforce',
  subversion: 'Subversion(SVN)',
  vcontainer: 'VContainer',
  unitask: 'UniTask',
  unirx: 'UniRx',
  r3: 'R3',
  feel: 'FEEL',
  udonSharp: 'Udon#',
  vrchat: 'VRChat',
  pun2: 'PUN2',
  reEngine: 'RE ENGINE',
  cocos2dx: 'Cocos2d-x',
  cPlusPlus: 'C++',
  cSharp: 'C#',
  python: 'Python',
  astro: 'Astro',
  react: 'React',
  typescript: 'TypeScript',
  makeRiddle: '謎制作',
  shader: 'Shader',
  figma: 'Figma',
  blender: 'Blender',
  davinciResolve: 'DaVinci Resolve',
  competitiveProgramming: '競技プログラミング',
} as const;

const GENRE = {
  game: 'ゲーム',
  riddle: '謎解き',
  web: 'Web',
} as const;

export const PROFILE = {
  name: 'どぐえぐ',
  title: 'どぐえぐ',
  tagline: 'ゲームを作るのが好きです',
  affiliation: '東京科学大学 情報理工学院 数理・計算科学系 学士3年',
  clubs: ['東京科学大学デジタル創作同好会traP', 'C-lock-row'],
  sections: {
    abaoutMeTitle: 'About Me',
    featuredTitle: 'Highlighted Works',
    featuredLead: '力を入れた作品',
    recentArticlesTitle: 'Recent Articles',
    recentArticlesLead: '直近の記事',
    worksTitle: 'Works',
    worksLead: 'これまでに制作したもの',
    skillsTitle: 'Skills',
    skillsLead: 'できること',
    careerTitle: 'Career',
    careerLead: 'インターン・イベント参加記録など',
    hobbyTitle: 'Hobbies',
    hobbyLead: '趣味・好きなこと',
  },
  footer: '© 2026 @inutamago-dogegg All rights reserved.',
  iconAlt: 'どぐえぐのアイコン',
} as const;

export const SOCIAL_LINKS = {
  x: {
    label: 'Twitter (X)',
    handle: '@dogegg314',
    url: 'https://x.com/dogegg314',
    icon: 'x',
  },
  github: {
    label: 'GitHub',
    handle: '@inutamago-dogegg',
    url: 'https://github.com/inutamago-dogegg',
    icon: 'github',
  },
  unityroom: {
    label: 'unityroom',
    handle: '@dogegg',
    url: 'https://unityroom.com/users/dogegg',
    icon: 'unityroom',
  }
} as const satisfies Record<'x' | 'github' | 'unityroom', AboutSocialLink>;

export const ABOUT_CONTENT = {
  subtitle: 'プロフィール',
  favoriteTechLabel: '好きな技術',
  favoriteTechText: 'ゲームクライアント全般',
  hobbyLabel: '趣味',
  hobbyText: 'ゲーム / 謎解き / 漫画',
  contactDisplayName: 'Ryuuei Nitto ( どぐえぐ )',
  socials: [
    SOCIAL_LINKS.x,
    SOCIAL_LINKS.github,
    SOCIAL_LINKS.unityroom,
  ] satisfies AboutSocialLink[],
  sections: [
    {
      title: '考え方',
      paragraphs: [
        'ゲームの面白さは、単にプログラムが正しく動くことだけでは生まれないと考えています。' +
        'どれほど技術的に優れていても、企画の意図や体験の核を理解していなければ、本質的な価値にはつながりません。' +
        'そのため、プログラマであってもそれらを深く理解し、「どのような論理でこの要素を実装することになったのか」を常に意識することが重要だと考えています。' +
        '仕様をそのまま形にするのではなく、企画の持つ面白さの芯を捉え、それを最大限に引き出す形で実装することが、エンジニアの役割だと考えています。' +
        'また、企画の魅力を損なうことなく、かつ実装面での課題を解決しながら、スムーズに実現へ導くことこそが、エンジニアとして最も価値のある貢献だと考えています。',
      ],
    },
    {
      title: '目指すキャリア',
      paragraphs: [
        '将来的には、単に実装を担当するだけではなく、企画の実現に根本から関われるエンジニアを目指しています。' +
        '技術力を軸にしながらも、企画意図・チーム状況・開発リソースなどを総合的に捉え、最適な形でプロダクトを実現できる存在になりたいと考えています。' +
        'また、自身の技術だけに閉じるのではなく、チーム全体の強みやリソースを引き出し、それらを組み合わせて価値を生み出すことも重要だと考えています。' +
        '最終的には、技術と企画の両方を理解し、実現の責任を担う、プロダクトマネージャーに近い立ち位置で貢献できるエンジニアになることを目標としています。',
      ],
    },
    {
      title: 'コンタクト',
      email: 'inutamago.dogegg@gmail.com',
    },
  ] satisfies AboutSection[],
} as const;

export const ABOUT_NAV_SECTIONS = [
  { id: 'top', label: PROFILE.sections.abaoutMeTitle },
  { id: 'skills', label: PROFILE.sections.skillsTitle },
  { id: 'career', label: PROFILE.sections.careerTitle },
  { id: 'featured', label: PROFILE.sections.featuredTitle },
  { id: 'recent-articles', label: PROFILE.sections.recentArticlesTitle },
  { id: 'hobby', label: PROFILE.sections.hobbyTitle },
] as const;

export const WORKS_NAV_SECTIONS = [{ id: 'works', label: PROFILE.sections.worksTitle }] as const;

const CGC_TECHS = [TECH.reEngine, TECH.cSharp, TECH.python, TECH.subversion, TECH.perforce];

export const CAREERS: CareerItem[] = [
  {
    company: 'C-lock-row',
    period: '2025年7月~現在',
    startDate: '2025-07-01',
    endDate: null,
    representativeDate: '2025-07-01',
    details: [
      '科学大の謎解き制作サークルです。',
    ],
    category: 'サークル',
    url: 'https://x.com/C_lock_row',
    tech: [TECH.makeRiddle],
  },
  {
    company: 'GREE Jobs',
    period: '2025年2月下旬~3月下旬',
    startDate: '2025-02-20',
    endDate: '2025-03-31',
    representativeDate: '2025-02-20',
    details: [
      'グリーさんに1ヶ月間インターンでお邪魔しました。ソーシャルゲームの新機能実装について、プランナーとの仕様決定から実装、QAとのやり取りまでの一通りの業務を行いました。',
      '新規実装タスク終了後は業務効率化ツールの機能改善の提案を自主的に行い実装をしました。'
    ],
    category: 'インターン',
    url: 'https://hd.gree.net/jp/ja/recruit/internship/jobs/',
    tech: [TECH.cocos2dx, TECH.cPlusPlus],
  },
  {
    company: 'CAPCOM GAMES COMPETITION',
    period: '準備期間: 2024年12月~2025年3月, 制作期間: 2025年4月~9月',
    startDate: '2024-12-01',
    endDate: '2025-09-30',
    representativeDate: '2025-04-01',
    details: [
      'サークルのメンバー20人でCAPCOM GAMES COMPETITIONというイベントに参加しました。',
      'ディレクター兼マネージャーとして経験者のメンバー19人をまとめ、企画~完成までを担当しました。'
    ],
    category: 'イベント',
    url: 'https://www.capcom-games.com/cgc/2025/ja-jp/',
    tech: CGC_TECHS,
  },
  {
    company: 'Game Speed Hackathon Autumn 2024',
    period: '2024年9月22日',
    startDate: '2024-09-22',
    endDate: '2024-09-22',
    representativeDate: '2024-09-22',
    details: ['CyberAgentさん主催のゲームの実装速度を競うイベントです。優勝することができました。'],
    category: 'イベント',
    url: 'https://cyberagent.snar.jp/jobboard/detail.aspx?id=ohkV1eN5MKVBUTT67mLh3g',
    tech: [TECH.unity, TECH.cSharp],
  },
  {
    company: 'CA Tech Job',
    period: '2024年9月',
    startDate: '2024-09-01',
    endDate: '2024-09-30',
    representativeDate: '2024-09-01',
    details: [
      'CyberAgentさんに1ヶ月インターンでお邪魔しました。ソーシャルゲームのゲームクライアントのパフォーマンスチューニングに取り組みました。',
      '渡されたタスクの終了後はパフォーマンス改善箇所を自ら調べPRを出しました。'
    ],
    category: 'インターン',
    url: 'https://www.cyberagent.co.jp/careers/students/event/detail/id=32004',
    tech: [TECH.unity, TECH.cSharp, TECH.git],
  },
  {
    company: 'コーエーテクモゲームエンジン開発インターンシップ',
    period: '2024年8月下旬~9月上旬',
    startDate: '2024-08-20',
    endDate: '2024-09-02',
    representativeDate: '2024-08-20',
    details: ['2週間でゲームエンジンの一機能について実装しました。'],
    category: 'インターン',
    url: 'https://job.tracks.run/internship/koeitecmoholdings-26-01',
    tech: [TECH.cPlusPlus],
  },
  {
    company: 'BitSummit Game Jam 2023',
    period: '2023年5月上旬~7月中旬',
    startDate: '2023-05-13',
    endDate: '2023-07-13',
    representativeDate: '2023-05-13',
    details: [
      'BitSummit Game Jamというイベントでリードプログラマとして制作しました。',
      '初対面のメンバー9人での制作でした。'
    ],
    category: 'イベント',
    url: 'https://bitsummit-gamejam.itch.io',
    tech: [TECH.unity, TECH.cSharp, TECH.git, TECH.unirx, TECH.unitask],
  },
  {
    company: '東京科学大学デジタル創作同好会traP',
    period: '2022年4月~現在',
    startDate: '2022-04-01',
    endDate: null,
    representativeDate: '2022-04-01',
    details: [
      '大学入学当初から加入しています。普段はここでゲーム制作をしています。',
      'ゲーム班長や渉外担当としても活動していましたが、既に後輩に引き継いでいます。',
    ],
    category: 'サークル',
    url: 'https://trap.jp',
    tech: [TECH.unity, TECH.cSharp, TECH.git, TECH.vcontainer, TECH.unitask, TECH.r3, TECH.feel, TECH.cPlusPlus],
  },
];

export const HOBBIES: HobbyItem[] = [
  {
    name: '謎解き',
    icon: '🔍',
    details: [
      'タンブルウィードによく行きます。',
      'Web謎やLINE謎も好きです。'
    ],
    favoritesLabel: '好きな謎解き公演',
    favorites: [
      { label: '海上の棺ヨーシズム号からの生還', url: 'https://tumbleweed.jp/event/yawsizm',
        note: 'マジで面白いです。'
      },
      { label: '転変の館ヨーカワリ荘からの生還', url: 'https://tumbleweed.jp/event/yawkawari',
        note: 'めちゃくちゃ面白いです。'
      },
      { label: '天空の沼ヨーフエル塔からの生還', url: 'https://tumbleweed.jp/event/yawfwel',
        note: 'すごい面白いです。'
      },
      { label: '未完', url: 'https://tumbleweed.jp/event/mikan',
        note: '本当に面白いです。'
      },
      { label: 'ROLE', url: 'https://tumbleweed.jp/event/role/',
        note: 'めっちゃ面白いです。'
      },
      { label: 'ここから先は自分の力で考えましょう。', url: 'https://www.xeoxy.com/event/ksk',
        note: 'はちゃめちゃに面白いです。'
      },
    ],
  },
  {
    name: '漫画',
    icon: '📚',
    details: [
      'ジャンプラに入ってます。',
      '少年漫画が好きです。'
    ],
    favoritesLabel: '好きな漫画',
    favorites: [
      { label: 'カグラバチ', url: 'https://shonenjumpplus.com/episode/17106371875870549182',
        note: '面白いです。'
      },
      { label: '亜人', url: 'https://pocket.shonenmagazine.com/title/01458/episode/324202',
        note: '面白いです。'
      },
      { label: '嘘喰い', url: 'https://ynjn.jp/title/129',
        note: '面白いです。'
      },
      { label: '宇宙兄弟', url: 'https://sbyomu.lp.koyamachuya.com/',
        note: '面白いです。'
      },
      { label: '僕のヒーローアカデミア', url: 'https://shonenjumpplus.com/episode/10833519556325021790',
        note: '面白いです。'
      },
      {
        label: 'メダリスト', url: 'https://pocket.shonenmagazine.com/title/01561/episode/331117',
        note: '面白いです。'
      }
    ],
  },
  {
    name: 'ゲーム(遊ぶ方)',
    icon: '🎮',
    details: [
      'インディーゲームをよく遊びます。',
      'ネタバレが致命的なゲームが好きなことが多いです。知識ゲートと言われるゲームが特に好きです。',
      '苦手・嫌いなジャンルは特にありません。'
    ],
    favoritesLabel: '好きなゲーム',
    favorites: [
      { label: 'The Witness', url: 'https://store.steampowered.com/app/210970/The_Witness/',
        note: '面白いです。'
      },
      { label: 'Outer Wilds', url: 'https://store.steampowered.com/app/753640/Outer_Wilds/',
        note: '人生で1番のゲームです。'
      },
      { label: 'パクレットのうさちゃん捕獲ゲーム', url: 'https://store.steampowered.com/app/1628610/_/',
        note: '面白いです。'
      },
      { label: 'Stray', url: 'https://store.steampowered.com/app/1332010/Stray/',
        note: '猫ちゃんが可愛い'
      },
      { label: 'Leap Year', url: 'https://store.steampowered.com/app/2951770/Leap_Year/',
        note: '面白いです。'
      },
      { label: 'モンスターハンター', url: 'https://www.monsterhunter.com/ja/',
        note: '面白いです。'
      },
    ],
  },
  {
    name: 'ゲーム(つくる方)',
    icon: '🛠️',
    details: [
      `${TECH.unity}, ${TECH.cSharp}を使います`,
      '面白さがゲーム画面上で実現された時が1番好きです。'
    ],
  },
];

export const SKILL_SECTIONS = {
  gameProgram: {
    title: 'ゲームプログラム',
    items: [
      {
        name: TECH.unity,
        icon: UnityIcon,
        level: 3,
        description: `普段のゲーム制作は${TECH.unity}を使っています。`,
      },
      {
        name: TECH.git,
        icon: GitIcon,
        level: 3,
        description: '個人制作・チーム制作で日常的に使っています。',
      },
      {
        name: TECH.unitask,
        icon: CysharpIcon,
        level: 3,
        description: '普段から非同期処理やゲームフロー作成に使用しています。',
      },
      {
        name: TECH.r3,
        icon: CysharpIcon,
        level: 3,
        description: 'View部分とModel部分の同期によく仕様しています。',
      },
      {
        name: TECH.cSharp,
        icon: CSharpIcon,
        level: 3,
        description: `${TECH.unity}を使う時に書いています。`,
      },
      {
        name: TECH.vcontainer,
        icon: VContainerIcon,
        level: 3,
        description: 'DIコンテナとして普段から使っています。',
      },
      {
        name: TECH.cPlusPlus,
        icon: CPlusPlusIcon,
        level: 2,
        description: `競プロで普段使っています。インターンで${TECH.cocos2dx}使用時に書いたことがあります。`,
      },
      {
        name: TECH.python,
        icon: PythonIcon,
        level: 2,
        description: '競プロで使っていました。軽いアプリ作成で使います。',
      },
      {
        name: TECH.shader,
        icon: UnityIcon,
        level: 2,
        description: 'UnityでShaderを書くことがあります。',
      },
      {
        name: TECH.udonSharp,
        icon: UdonSharpIcon,
        level: 1,
        description: `${TECH.vrchat}向けの制作で触れました。`,
      },
      {
        name: TECH.pun2,
        icon: PUN2Icon,
        level: 1,
        description: 'オンライン同期で使用しました。',
      },
      {
        name: TECH.cocos2dx,
        icon: Cocos2dxIcon,
        level: 1,
        description: 'インターンで1ヶ月ほど使用しました。',
      },
      {
        name: TECH.perforce,
        icon: PerforceIcon,
        level: 1,
        description: 'CAPCOM GAMES COMPETITIONで6ヶ月間使用しました',
      },
      {
        name: TECH.subversion,
        icon: SvnIcon,
        level: 1,
        description: 'CAPCOM GAMES COMPETITIONで6ヶ月間使用しました。',
      },
    ] satisfies SkillItem[],
  },
  graphic: {
    title: 'グラフィック',
    items: [
      {
        name: TECH.figma,
        icon: FigmaIcon,
        level: 2,
        description: `素材作成やデザイン作成を少しだけ行えます。`,
      },
      {
        name: TECH.blender,
        icon: BlenderIcon,
        level: 1,
        description: `基礎的な操作ができます。`,
      },
      {
        name: TECH.davinciResolve,
        icon: DaVinciResolveIcon,
        level: 1,
        description: `動画編集を少しだけ行えます。`,
      }
    ] satisfies SkillItem[],
  },
  others: {
    title: 'その他',
    items: [
      {
        name: TECH.competitiveProgramming,
        level: 1,
        description: `AtCoderのレートは茶色です。C++で参加しています。`,
      }
    ] satisfies SkillItem[],
  }
} as const;

export const PROJECTS: ProjectYearGroup[] = [
  {
    year: '2025',
    items: [
      {
        title: 'このサイト',
        period: '2026年1月~現在',
        tech: [TECH.astro, TECH.react, TECH.typescript],
        member: '1人',
        outline: 'ポートフォリオサイトも兼ねて自分のホームページをつくりました',
        genre: GENRE.web,
        playLink: { label: 'このページ', url: 'https://inutamago-dogegg.github.io/dogegg/'},
        detailMarkdown: `
### やったこと
Web制作は初めてでしたが、デザインはFigma AI、コーディングはCursorに手伝ってもらい公開まで何とかできました。
`,
        headerImage: DogeggIcon,
        githubUrl: 'https://github.com/inutamago-dogegg/dogegg',
      },
      {
        title: 'ELEGO',
        period: '2025年4月~9月 (6か月)',
        tech: CGC_TECHS,
        member: '20人(プランナー5人, プログラマー6人, 3Dデザイナー4人, 2Dデザイナー2人, シナリオ1人, サウンド2人)',
        outline: '感情を利用し敵を操って脱出を目指すステルスアクションゲーム',
        detailMarkdown: `
### やったこと
[CAPCOM GAMES COMPETITION](https://www.capcom-games.com/cgc/2025/ja-jp/)というイベントで制作しました。ディレクター兼マネージャーとして経験者のメンバー19人をまとめ、企画~完成までを担当しました。未知のエンジン・6か月で完全締め切り・3Dアクション制作未経験という状況ながら、なんとか完成まで持っていきました。
`,
        genre: GENRE.game,
        playLink: { label: LABELS.play, url: 'https://gameparade.creators-guild.com/works/3532' },
        relatedLinks: [{ label: 'CAPCOM GAMES COMPETITION 公式ページ', url: 'https://www.capcom-games.com/cgc/2025/ja-jp/' }],
        headerImage: ElegoHeader,
        awards: ['ゲームクリエイター甲子園2025セミファイナリスト'],
        xUrl: 'https://x.com/cgc2025_trap',
      },
      {
        title: '2',
        period: '',
        tech: [TECH.makeRiddle],
        member: '',
        outline: '',
        detailMarkdown: `
### やったこと
全体構成・当日スタッフに関わりました。
`,
        genre: GENRE.riddle,
        playLink: { label: LABELS.ticket, url: 'https://escape.id/Clockrow-org/e-url-wo-atenaidene22222/' },
        headerImage: NiHeader,
      },
      {
        title: 'Deeper and Deeper',
        period: '2025年12月 (準備1週間, 制作1週間)',
        tech: [TECH.unityUrp, TECH.unity, TECH.git, TECH.vcontainer, TECH.unitask],
        member: '8人(プランナー1人, プログラマー3人, 2Dデザイナー3人, サウンド1人)',
        outline: 'ダンジョンの深く深くに進みお宝を手に入れて帰還するゲーム',
        detailMarkdown: `
### やったこと
リードプログラマとしてほぼ全てのプログラムを書きました。
`,
        genre: GENRE.game,
        playLink: { label: LABELS.play, url: 'https://unityroom.com/games/deeper_and_deeper?ref=trap.jp' },
        relatedLinks: [{ label: LABELS.related, url: 'https://trap.jp/post/2798/' }, { label: LABELS.related, url: 'https://trap.jp/post/2799/' }],
        headerImage: DeeperHeader,
      },
    ],
  },
  {
    year: '2024',
    items: [
      {
        title: 'Cross the C',
        period: '2024年7月~現在 (約1年半)',
        tech: [TECH.unityUrp, TECH.git, TECH.r3, TECH.unitask, TECH.vcontainer],
        member: '約15人(プランナー4人, プログラマー3人, 3Dデザイナー3人, 2Dデザイナー1人, パズル制作7人)',
        outline: '船を操作してゴールを目指す氷床パズルゲーム',
        detailMarkdown: `
### やったこと
ディレクター・マネージャー・リードプログラマとして参加しています。
`,
        genre: GENRE.game,
        playLink: { label: LABELS.play, url: 'https://gameparade.creators-guild.com/works/2763' },
        headerImage: CrossHeader,
        awards: ['ゲームクリエイター甲子園2024総合大賞ノミネート', 'ゲームクリエイター甲子園2025総合大賞ノミネート'],
        xUrl: 'https://x.com/CrosstheC_trap',
        steamUrl: 'https://store.steampowered.com/app/3382690/Cross_the_C/'
      },
      {
        title: 'Queen Bee',
        period: '2025年1月 (準備1週間, 制作1週間)',
        tech: [TECH.unity, TECH.git, TECH.unitask],
        member: '6人(プランナー1人, プログラマー3人, 2Dデザイナー2人, サウンド1人)',
        outline: '主人公・野心萌(やしん もえ)が学園トップを目指す学園シミュレーションカードゲーム',
        detailMarkdown: `
### やったこと
リーダー兼リードプログラマとして制作しました。同じ学年で対等なメンバーが多く、白熱した企画議論ができましたが、あまりまとまりませんでした。拙いながらも仕様決定をし、メンバーに指示出しをしながら最後までプログラムを書きました。
`,
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
        member: '5人(プログラマー3人, 2Dデザイナー2人)',
        outline: 'ひらがなを吸収して変身して戦う2D弾幕アクションゲーム',
        detailMarkdown: `
### やったこと
プログラマ兼チームリーダーとして、新入生への講習やサポート・レビューなどを行いながら、2日で完成させられるゲーム性の考案やプログラム制作を行いました。
`,
        genre: GENRE.game,
        playLink: { label: LABELS.play, url: 'https://trap.jp/post/1911/' },
        relatedLinks: [{ label: LABELS.related, url: 'https://trap.jp/post/1911/' }],
      },
      {
        title: 'Memory Transer',
        period: '2023年5月~7月 (約2か月)',
        tech: [TECH.unity, TECH.git, TECH.unirx, TECH.unitask],
        member: '9人(プランナー4人, プログラマー4人, 2Dデザイナー1人)',
        outline: '記憶を整理するアクションゲーム',
        detailMarkdown: `
### やったこと
BitSummit Game Jam 2023で制作しました。リードエンジニアとして立候補し、他メンバーへのGitやコードエディター(Rider)の講習を行い、設計からタスクの割り振りまで行いました。途中からメンバーの脱落があり、急遽集会を開くなどして完成まで持っていきました。
`,
        genre: GENRE.game,
        playLink: { label: LABELS.play, url: 'https://bitsummit-gamejam.itch.io/memorytranser' },
        githubUrl: 'https://github.com/BSGJ2023-T-Team07/MemoryTranser',
      },
      {
        title: 'バリバリベンジ',
        period: '2023年7月~現在 (約2年半)',
        tech: [TECH.unity, TECH.git, TECH.r3, TECH.unitask, TECH.feel],
        member: '約10人(プランナー3人, プログラマー5人, 2Dデザイナー2人, サウンド2人, 弾幕制作2人)',
        outline: '敵の出してくる弾をパリィし敵に直接アタックする弾幕ゲー×2Dアクションの新感覚ゲーム！',
        detailMarkdown: `
### やったこと
企画者に誘われ、リードプログラマとして技術的な面でメンバーを引っ張りました。プログラマでない人も敵の制作ができるようにエディター拡張に特に力を入れました。
`,
        genre: GENRE.game,
        playLink: { label: LABELS.play, url: 'https://gameparade.creators-guild.com/works/1559' },
        relatedLinks: [{ label: LABELS.related, url: 'https://trap.jp/post/1971/' }],
        headerImage: VariVaRevengeHeader,
        awards: ['ゲームクリエイター甲子園2024総合大賞ノミネート', 'Game^3 19th 優秀賞'],
        steamUrl: 'https://store.steampowered.com/app/2721190/_/',

      },
      {
        title: 'Orbit',
        period: '2023年12月 (準備1週間, 制作1週間)',
        tech: [TECH.unityUrp, TECH.git, TECH.unirx, TECH.unitask],
        member: '5人(プランナー1人, プログラマー3人, 2Dデザイナー3人, サウンド1人)',
        outline: '星を回りながらその秘密を探るリソース管理アドベンチャー',
        detailMarkdown: `
### やったこと
メインプログラマとしてコードやGitの規約を定め、協力して設計とゲームの実装を行いました。英語版対応・バグ修正をしてSteamで配信しています。
`,
        genre: GENRE.game,
        playLink: { label: LABELS.play, url: 'https://store.steampowered.com/app/2990710/Orbit/?l=japanese' },
        relatedLinks: [{ label: LABELS.related, url: 'https://trap.jp/post/2106/' }],
        headerImage: OrbitHeader,
        awards: ['部内冬ハッカソン23 最優秀賞'],
        steamUrl: 'https://store.steampowered.com/app/2990710/Orbit/'
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
        member: '5人(プログラマ4人, 2Dデザイナー1人)',
        outline: '目玉に見つからないように主人公のゆうちゃんを操作してゴールを目指すアクションゲーム',
        detailMarkdown: `
### やったこと
初心者枠として参加し、先輩の助けを借りながらプログラムを軽く書き、ゲームの仕様考案とステージ制作を主に行いました。
`,
        genre: GENRE.game,
        playLink: { label: LABELS.play, url: 'https://trap.jp/post/1607/' },
        relatedLinks: [{ label: LABELS.related, url: 'https://trap.jp/post/1607/' }],
        awards: ['春ハッカソン22 Emoine賞'],
      },
      {
        title: 'Logical Room',
        period: '2022年7月~2023年11月 (1年5か月)',
        tech: [TECH.unity, TECH.git],
        member: '約10人(プログラマー8人, 2Dデザイナー1人)',
        outline: '単純なルールが複雑に絡み合う2Dパズルアクションゲーム',
        detailMarkdown: `
### やったこと
プログラマとして参加し、プレイヤー挙動やゲームシステムなどのバグ修正・新規実装・リファクター・改良などを行いました。
`,
        genre: GENRE.game,
        playLink: { label: LABELS.play, url: 'https://trap.jp/post/2037/' },
        relatedLinks: [{ label: LABELS.related, url: 'https://trap.jp/post/2037/' }],
      },
      {
        title: 'School Breakin` Tag',
        period: '2022年11月~2023年11月 (1年)',
        tech: [TECH.unity, TECH.git, TECH.udonSharp, TECH.vrchat],
        member: '約8人(プログラマー5人, 3Dデザイナー3人)',
        outline: '学校を舞台に地形を破壊できる爆弾を使って逃げ回るVRおにごっこ',
        detailMarkdown: `
### やったこと
プロジェクト経験のあるプログラマとして初めは参加しました。しかし途中からリーダーがキャパオーバーしてしまい、サブリーダーとして制作を進行しました。他メンバーのGit周りのサポートやタスクのマネジメントなどを行いました。
`,
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
        member: '5人(プログラマー3人, 2Dデザイナー1人, サウンド1人)',
        outline: '野菜を育てて撃って戦う2D対戦アクションゲームです。',
        detailMarkdown: `
### やったこと
プロジェクト経験のあるプログラマとしてゲームの実装を行いました。
`,
        genre: GENRE.game,
        playLink: { label: LABELS.play, url: 'https://trap.jp/post/1746/' },
        relatedLinks: [{ label: LABELS.related, url: 'https://trap.jp/post/1746/' }],
        awards: ['部内冬ハッカソン22 優秀賞'],
      },
    ],
  },
];

export const ARTICLES: ArticleItem[] = [
  {
    date: '2026-02-01',
    url: 'https://trap.jp/post/2799/',
  },
  {
    date: '2026-01-15',
    url: 'https://trap.jp/post/2798/',
  },
  {
    date: '2025-02-04',
    url: 'https://trap.jp/post/2483/',
  },
  {
    date: '2024-10-22',
    url: 'https://trap.jp/post/2394/',
  },
  {
    date: '2024-10-05',
    url: 'https://trap.jp/post/2392/',
  },
  {
    date: '2024-09-20',
    url: 'https://trap.jp/post/2377/'
  },
  {
    date: '2024-05-08',
    url: 'https://trap.jp/post/1911/',
  },
  {
    date: '2024-04-14',
    url: 'https://trap.jp/post/2200/'
  },
  {
    date: '2024-03-14',
    url: 'https://trap.jp/post/2144/'
  },
  {
    date: '2024-03-08',
    url: 'https://trap.jp/post/2142/'
  },
  {
    date: '2024-01-16',
    url: 'https://trap.jp/post/2106/'
  },
  {
    date: '2023-11-21',
    url: 'https://trap.jp/post/2026/'
  },
  {
    date: '2023-11-14',
    url: 'https://trap.jp/post/2037/'
  },
  {
    date: '2023-03-27',
    url: 'https://trap.jp/post/1818/'
  },
  {
    date: '2022-12-30',
    url: 'https://trap.jp/post/1746/'
  },
  {
    date: '2022-10-21',
    url: 'https://trap.jp/post/1696/'
  },
  {
    date: '2022-06-27',
    url: 'https://trap.jp/post/1607/'
  }
];