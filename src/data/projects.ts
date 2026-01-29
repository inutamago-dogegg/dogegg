import type { ImageMetadata } from 'astro';
import CrossHeader from '@/images/Cross_the_C_Header.png';
import DeeperHeader from '@/images/Deeper_and_Deeper_Header.png';
import ElegoHeader from '@/images/ELEGO_Header.png';
import NiHeader from '@/images/Ni_Header.png';
import OrbitHeader from '@/images/Orbit_Header.png';
import QueenBeeHeader from '@/images/QueenBee_Header.png';
import VariVaRevengeHeader from '@/images/VariVaRevenge_Header.png';

const LABELS = {
  play: 'プレイリンク',
  related: '関連記事',
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
} as const;

const GENRE = {
  game: 'ゲーム',
  riddle: '謎解き',
} as const;

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
        appeal: 'リーダー・リードプログラマとして参加しました。',
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
        appeal: '企画者に誘われ、リードプログラマとして技術的な面でメンバーを引っ張りました。プログラマでない人も敵の制作ができるようにエディター拡張に特に力を入れました。中盤から元リーダーが忙しくなり、リーダーとしても活動しています。',
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
