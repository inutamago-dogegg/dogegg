import CrossHeader from '@/images/Cross_the_C_Header.png';
import DeeperHeader from '@/images/Deeper_and_Deeper_Header.png';
import ElogoHeader from '@/images/ELEGO_Header.png';
import OrbitHeader from '@/images/Orbit_Header.png';
import QueenBeeHeader from '@/images/QueenBee_Header.png';
import VariVaRevengeHeader from '@/images/VariVaRevenge_Header.png';
import type { ImageMetadata } from 'astro';

export type ProjectLink = {
  label: string;
  url: string;
};

export type ProjectItem = {
  title: string;
  period: string;
  tech: string[];
  role: string;
  playLink?: ProjectLink;
  relatedLinks?: ProjectLink[];
  headerImage?: ImageMetadata;
  awards?: string[];
};

export type ProjectYearGroup = {
  year: string;
  items: ProjectItem[];
};

export const projects: ProjectYearGroup[] = [
  {
    year: '2022',
    items: [
      {
        title: 'つかまらないで！ゆうちゃん',
        period: '2022年6月 (準備1週間, 制作1週間)',
        tech: ['Unity', 'Git'],
        role: '初心者枠として参加し、先輩の助けを借りながらプログラムを軽く書き、ゲームの仕様考案とステージ制作を主に行いました。',
        playLink: { label: 'プレイリンク', url: 'https://trap.jp/post/1607/' },
        relatedLinks: [{ label: '関連記事', url: 'https://trap.jp/post/1607/' }],
        awards: ['春ハッカソン22 Emoine賞'],
      },
      {
        title: 'Logical Room',
        period: '2022年7月～2023年11月 (1年5か月)',
        tech: ['Unity', 'Git'],
        role: 'プログラマとして参加し、プレイヤー挙動やゲームシステムなどのバグ修正・新規実装・リファクター・改良などを行いました。',
        playLink: { label: 'プレイリンク', url: 'https://trap.jp/post/2037/' },
      },
      {
        title: 'School Breakin` Tag',
        period: '2022年11月～2023年11月 (1年)',
        tech: ['Unity', 'Git', 'Udon#', 'VRChat'],
        role: 'プロジェクト経験のあるプログラマとして初めは参加しました。しかし途中からリーダーがキャパオーバーしてしまい、サブリーダーとして制作を進行しました。他メンバーのGit周りのサポートやタスクのマネジメントなどを行いました。',
        playLink: {
          label: 'プレイリンク',
          url: 'https://vrchat.com/home/launch?worldId=wrld_5fddc89d-6c2f-4208-8873-038ea25f80c5&instanceType=friend+',
        },
        relatedLinks: [{ label: '関連記事', url: 'https://trap.jp/post/2026/' }],
        awards: ['IVRC2024メタバース部門 Unity賞'],
      },
      {
        title: 'Root Shooter',
        period: '2022年12月 (準備1週間, 制作1週間)',
        tech: ['Unity', 'Git', 'PUN2'],
        role: 'プロジェクト経験のあるプログラマとしてゲームの実装を行いました。',
        playLink: { label: 'プレイリンク', url: 'https://trap.jp/post/1746/' },
        relatedLinks: [{ label: '関連記事', url: 'https://trap.jp/post/1746/' }],
        awards: ['部内冬ハッカソン22 優秀賞'],
      },
    ],
  },
  {
    year: '2023',
    items: [
      {
        title: '「」か？',
        period: '2023年6月 (準備1週間, 制作2日)',
        tech: ['Unity', 'Git'],
        role: 'プログラマ兼チームリーダーとして、新入生への講習やサポート・レビューなどを行いながら、2日で完成させられるゲーム性の考案やプログラム制作を行いました。',
        playLink: { label: 'プレイリンク', url: 'https://trap.jp/post/1911/' },
        relatedLinks: [{ label: '関連記事', url: 'https://trap.jp/post/1911/' }],
      },
      {
        title: 'Memory Transer',
        period: '2023年5月～7月 (約2か月)',
        tech: ['Unity', 'Git', 'UniRx', 'UniTask'],
        role: 'リードエンジニアとして立候補し、他メンバーへのGitやコードエディター(Rider)の講習を行い、設計からタスクの割り振りまで行いました。途中からメンバーの脱落があり、急遽集会を開くなどして完成まで持っていきました。',
        playLink: { label: 'プレイリンク', url: 'https://bitsummit-gamejam.itch.io/memorytranser' },
      },
      {
        title: 'バリバリベンジ',
        period: '2023年7月～現在 (約2年半)',
        tech: ['Unity', 'Git', 'R3', 'UniTask', 'Feel'],
        role: '企画者に誘われ、リードプログラマとして技術的な面でメンバーを引っ張りました。プログラマでない人も敵の制作ができるようにエディター拡張に特に力を入れました。中盤から元リーダーが忙しくなり、リーダーとしても活動しています。',
        playLink: { label: 'プレイリンク', url: 'https://gameparade.creators-guild.com/works/1559' },
        headerImage: VariVaRevengeHeader,
        awards: ['ゲームクリエイター甲子園2024総合大賞ノミネート', 'Game^3 19th 優秀賞'],
      },
      {
        title: 'Orbit',
        period: '2023年12月 (準備1週間, 制作1週間)',
        tech: ['Unity URP', 'Git', 'UniRx', 'UniTask'],
        role: 'メインプログラマとしてコードやGitの規約を定め、協力して設計とゲームの実装を行いました。英語版対応をしてSteamで配信しています。',
        playLink: { label: 'プレイリンク', url: 'https://store.steampowered.com/app/2990710/Orbit/?ref=trap.jp' },
        relatedLinks: [{ label: '関連記事', url: 'https://trap.jp/post/2106/' }],
        headerImage: OrbitHeader,
        awards: ['部内冬ハッカソン23 最優秀賞'],
      },
    ],
  },
  {
    year: '2024',
    items: [
      {
        title: '（未完成）部内春ハッカソン',
        period: '2024年7月 (準備1週間, 制作2日)',
        tech: ['Unity URP', 'Git', 'R3', 'UniTask'],
        role: 'リーダーとして企画～完成までを担当しました。しかし、同時期に別プロジェクトの準備が重なり、あまり専念できないまま制作を迎え、完成しないまま終わってしまいました。',
      },
      {
        title: 'Cross the C',
        period: '2024年7月～現在 (約1年半)',
        tech: ['Unity URP', 'Git', 'R3', 'UniTask', 'VContainer'],
        role: 'リーダーとして参加しています。',
        playLink: { label: 'プレイリンク', url: 'https://gameparade.creators-guild.com/works/2763' },
        relatedLinks: [{ label: '関連リンク', url: 'https://store.steampowered.com/app/3382690/Cross_the_C/' }],
        headerImage: CrossHeader,
        awards: ['ゲームクリエイター甲子園2024総合大賞ノミネート', 'ゲームクリエイター甲子園2025総合大賞ノミネート'],
      },
      {
        title: 'Queen Bee',
        period: '2025年1月 (準備1週間, 制作1週間)',
        tech: ['Unity', 'Git', 'UniTask'],
        role: 'リーダー・リードプログラマとして参加しました。',
        playLink: { label: 'プレイリンク', url: 'https://unityroom.com/games/queenbee' },
        relatedLinks: [{ label: '関連記事', url: 'https://trap.jp/post/2483/' }],
        headerImage: QueenBeeHeader,
      },
    ],
  },
  {
    year: '2025',
    items: [
      {
        title: 'ELEGO',
        period: '2025年4月～9月 (6か月)',
        tech: ['RE Engine'],
        role: 'CAPCOM GAMES COMPETITIONというイベントで制作しました。ディレクター兼マネージャーとして経験者のメンバー19人をまとめ、企画～完成までを担当しました。未知のエンジン・6か月で完全締め切り・3Dアクション制作未経験という状況ながら、なんとか完成まで持っていきました。',
        playLink: { label: 'プレイリンク', url: 'https://gameparade.creators-guild.com/works/3532' },
        relatedLinks: [{ label: '関連記事', url: 'https://www.capcom-games.com/cgc/2025/ja-jp/' }],
        headerImage: ElogoHeader,
        awards: ['ゲームクリエイター甲子園2025セミファイナリスト'],
      },
      {
        title: 'Deeper and Deeper',
        period: '2025年12月 (準備1週間, 制作1週間)',
        tech: ['Unity', 'Git', 'VContainer', 'UniTask'],
        role: 'リードプログラマとしてほぼ全てのプログラムを書きました。',
        playLink: { label: 'プレイリンク', url: 'https://unityroom.com/games/deeper_and_deeper?ref=trap.jp' },
        relatedLinks: [{ label: '関連記事', url: 'https://trap.jp/post/2798/' }],
        headerImage: DeeperHeader,
      },
    ],
  },
];

export const careers = [
  { period: '2025年2月～3月', company: 'GREE Jobs' },
  { period: '2024年9月', company: 'CA Tech Job' },
  { period: '2022年4月～現在', company: '東京科学大学デジタル創作同好会traP' },
  { period: '2025年7月～現在', company: 'C-lock-row' },
];

export const hobbies = [
  { name: 'ゲーム制作', description: '短いプロトタイプで遊び心地を検証します', icon: '🛠️' },
  { name: 'ゲームプレイ', description: '体験設計を観察しながら幅広く遊びます', icon: '🎮' },
  { name: '謎解き', description: '仕掛けや導線の作り方に興味があります', icon: '🔍' },
];
