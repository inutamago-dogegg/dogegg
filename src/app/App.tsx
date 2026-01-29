import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Github, ExternalLink, Award, Briefcase, Sun, Moon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import avatarIcon from '@/images/dogegg_icon.png';
import CrossHeader from '@/images/Cross_the_C_Header.png';
import DeeperHeader from '@/images/Deeper_and_Deeper_Header.png';
import ElegoHeader from '@/images/ELEGO_Header.png';
import NiHeader from '@/images/Ni_Header.png';
import OrbitHeader from '@/images/Orbit_Header.png';
import QueenBeeHeader from '@/images/QueenBee_Header.png';
import VariVaRevengeHeader from '@/images/VariVaRevenge_Header.png';
import type { ImageMetadata } from 'astro';
import type { OgpData } from '@/lib/ogp';

type ThemeKey = 'spring' | 'summer' | 'autumn' | 'winter';

type ProjectLink = {
  label: string;
  url: string;
};

type ProjectGenre = 'ゲーム' | '謎解き';

type ProjectItem = {
  title: string;
  period: string;
  tech: string[];
  role: string;
  genre: ProjectGenre;
  playLink?: ProjectLink;
  relatedLinks?: ProjectLink[];
  headerImage?: ImageMetadata;
  awards?: string[];
};

type OgpMap = Record<string, OgpData>;

type CareerItem = {
  company: string;
  period: string;
  details: string[];
};

type HobbyLink = {
  label: string;
  url: string;
};

type HobbyItem = {
  name: string;
  icon: string;
  details: string[];
  favoritesLabel?: string;
  favorites?: HobbyLink[];
};

const themeConfig = {
  spring: {
    name: '春',
    emoji: '🌸',
    palettes: {
      light: {
        fromColor: '#fdf2f8',
        toColor: '#fff1f2',
        navBg: 'bg-white/90',
        navBorder: 'border-gray-200',
        textPrimary: 'text-gray-900',
        textSecondary: 'text-gray-700',
        textMuted: 'text-gray-500',
        surfaceBg: 'bg-white/90',
        surfaceBorder: 'border-gray-200',
        chipBg: 'bg-gray-100',
        chipText: 'text-gray-700',
        buttonBg: 'bg-pink-500 hover:bg-pink-600',
        buttonOutline: 'border-pink-500 text-pink-600 hover:bg-pink-50',
        cardBorder: 'border-pink-200 hover:border-pink-400',
        cardBorderStatic: 'border-pink-200',
        badgeBg: 'bg-pink-100 border-pink-200 text-pink-700 hover:bg-pink-200',
        decorativeColors: ['bg-pink-300', 'bg-rose-300', 'bg-pink-200'],
      },
      dark: {
        fromColor: '#2a121a',
        toColor: '#120a0f',
        navBg: 'bg-slate-900/80',
        navBorder: 'border-slate-700',
        textPrimary: 'text-slate-100',
        textSecondary: 'text-slate-300',
        textMuted: 'text-slate-400',
        surfaceBg: 'bg-slate-900/70',
        surfaceBorder: 'border-slate-700',
        chipBg: 'bg-slate-800',
        chipText: 'text-slate-200',
        buttonBg: 'bg-pink-600 hover:bg-pink-500',
        buttonOutline: 'border-pink-300 text-pink-200 hover:bg-pink-900/30',
        cardBorder: 'border-pink-900 hover:border-pink-700',
        cardBorderStatic: 'border-pink-900',
        badgeBg: 'bg-pink-900/50 border-pink-800 text-pink-100 hover:bg-pink-800/60',
        decorativeColors: ['bg-pink-800/40', 'bg-rose-800/40', 'bg-pink-700/40'],
      },
    },
  },
  summer: {
    name: '夏',
    emoji: '☀️',
    palettes: {
      light: {
        fromColor: '#eff6ff',
        toColor: '#ecfeff',
        navBg: 'bg-white/90',
        navBorder: 'border-gray-200',
        textPrimary: 'text-gray-900',
        textSecondary: 'text-gray-700',
        textMuted: 'text-gray-500',
        surfaceBg: 'bg-white/90',
        surfaceBorder: 'border-gray-200',
        chipBg: 'bg-gray-100',
        chipText: 'text-gray-700',
        buttonBg: 'bg-blue-500 hover:bg-blue-600',
        buttonOutline: 'border-blue-500 text-blue-600 hover:bg-blue-50',
        cardBorder: 'border-blue-200 hover:border-blue-400',
        cardBorderStatic: 'border-blue-200',
        badgeBg: 'bg-blue-100 border-blue-200 text-blue-700 hover:bg-blue-200',
        decorativeColors: ['bg-blue-300', 'bg-cyan-300', 'bg-sky-300'],
      },
      dark: {
        fromColor: '#0b1220',
        toColor: '#07131d',
        navBg: 'bg-slate-900/80',
        navBorder: 'border-slate-700',
        textPrimary: 'text-slate-100',
        textSecondary: 'text-slate-300',
        textMuted: 'text-slate-400',
        surfaceBg: 'bg-slate-900/70',
        surfaceBorder: 'border-slate-700',
        chipBg: 'bg-slate-800',
        chipText: 'text-slate-200',
        buttonBg: 'bg-blue-600 hover:bg-blue-500',
        buttonOutline: 'border-blue-300 text-blue-200 hover:bg-blue-900/30',
        cardBorder: 'border-blue-900 hover:border-blue-700',
        cardBorderStatic: 'border-blue-900',
        badgeBg: 'bg-blue-900/50 border-blue-800 text-blue-100 hover:bg-blue-800/60',
        decorativeColors: ['bg-blue-800/40', 'bg-cyan-800/40', 'bg-sky-800/40'],
      },
    },
  },
  autumn: {
    name: '秋',
    emoji: '🍂',
    palettes: {
      light: {
        fromColor: '#fff7ed',
        toColor: '#fffbeb',
        navBg: 'bg-white/90',
        navBorder: 'border-gray-200',
        textPrimary: 'text-gray-900',
        textSecondary: 'text-gray-700',
        textMuted: 'text-gray-500',
        surfaceBg: 'bg-white/90',
        surfaceBorder: 'border-gray-200',
        chipBg: 'bg-gray-100',
        chipText: 'text-gray-700',
        buttonBg: 'bg-orange-500 hover:bg-orange-600',
        buttonOutline: 'border-orange-500 text-orange-600 hover:bg-orange-50',
        cardBorder: 'border-orange-200 hover:border-orange-400',
        cardBorderStatic: 'border-orange-200',
        badgeBg: 'bg-orange-100 border-orange-200 text-orange-700 hover:bg-orange-200',
        decorativeColors: ['bg-orange-300', 'bg-amber-300', 'bg-yellow-300'],
      },
      dark: {
        fromColor: '#1b1207',
        toColor: '#0f0a05',
        navBg: 'bg-slate-900/80',
        navBorder: 'border-slate-700',
        textPrimary: 'text-slate-100',
        textSecondary: 'text-slate-300',
        textMuted: 'text-slate-400',
        surfaceBg: 'bg-slate-900/70',
        surfaceBorder: 'border-slate-700',
        chipBg: 'bg-slate-800',
        chipText: 'text-slate-200',
        buttonBg: 'bg-orange-600 hover:bg-orange-500',
        buttonOutline: 'border-orange-300 text-orange-200 hover:bg-orange-900/30',
        cardBorder: 'border-orange-900 hover:border-orange-700',
        cardBorderStatic: 'border-orange-900',
        badgeBg: 'bg-orange-900/50 border-orange-800 text-orange-100 hover:bg-orange-800/60',
        decorativeColors: ['bg-orange-800/40', 'bg-amber-800/40', 'bg-yellow-800/40'],
      },
    },
  },
  winter: {
    name: '冬',
    emoji: '❄️',
    palettes: {
      light: {
        fromColor: '#f8fafc',
        toColor: '#eff6ff',
        navBg: 'bg-white/90',
        navBorder: 'border-gray-200',
        textPrimary: 'text-gray-900',
        textSecondary: 'text-gray-700',
        textMuted: 'text-gray-500',
        surfaceBg: 'bg-white/90',
        surfaceBorder: 'border-gray-200',
        chipBg: 'bg-gray-100',
        chipText: 'text-gray-700',
        buttonBg: 'bg-slate-600 hover:bg-slate-700',
        buttonOutline: 'border-slate-600 text-slate-600 hover:bg-slate-50',
        cardBorder: 'border-slate-200 hover:border-slate-400',
        cardBorderStatic: 'border-slate-200',
        badgeBg: 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200',
        decorativeColors: ['bg-slate-300', 'bg-blue-300', 'bg-slate-200'],
      },
      dark: {
        fromColor: '#0b111a',
        toColor: '#0a1621',
        navBg: 'bg-slate-900/80',
        navBorder: 'border-slate-700',
        textPrimary: 'text-slate-100',
        textSecondary: 'text-slate-300',
        textMuted: 'text-slate-400',
        surfaceBg: 'bg-slate-900/70',
        surfaceBorder: 'border-slate-700',
        chipBg: 'bg-slate-800',
        chipText: 'text-slate-200',
        buttonBg: 'bg-slate-600 hover:bg-slate-500',
        buttonOutline: 'border-slate-300 text-slate-200 hover:bg-slate-900/30',
        cardBorder: 'border-slate-800 hover:border-slate-600',
        cardBorderStatic: 'border-slate-800',
        badgeBg: 'bg-slate-900/50 border-slate-800 text-slate-100 hover:bg-slate-800/60',
        decorativeColors: ['bg-slate-700/40', 'bg-blue-800/40', 'bg-slate-800/40'],
      },
    },
  },
};

const LABELS = {
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

const PROFILE = {
  name: 'どぐえぐ',
  title: 'どぐえぐ',
  tagline: '持っている力を使って面白いゲームを作り出すのが好きです',
  affiliation: '東京科学大学 情報理工学院 数理・計算科学系 学士3年',
  clubs: '東京科学大学デジタル創作同好会traP / C-lock-row',
  skills: 'Unity, C#を使ってゲーム制作をしています',
  sections: {
    abaoutMeTitle: 'About Me',
    worksTitle: 'Products',
    worksLead: 'これまでに制作したもの',
    careerTitle: 'Career',
    hobbyTitle: 'Hobbies',
  },
  footer: '© 2026 どぐえぐ ホームページ. All rights reserved.',
  iconAlt: 'どぐえぐのアイコン',
} as const;

const NAV_SECTIONS = [
  { id: 'top', label: PROFILE.sections.abaoutMeTitle },
  { id: 'works', label: PROFILE.sections.worksTitle },
  { id: 'career', label: PROFILE.sections.careerTitle },
  { id: 'hobby', label: PROFILE.sections.hobbyTitle },
] as const;

export const CAREERS: CareerItem[] = [
  {
    company: 'C-lock-row',
    period: '2025年7月~現在',
    details: ['最近謎解き制作の方を始めました。'],
  },
  {
    company: 'GREE Jobs',
    period: '2025年2月~3月',
    details: ['1ヶ月のインターンに参加しました。ソーシャルゲームの新規機能の実装に取り組みました。'],
  },
  {
    company: 'CA Tech Job',
    period: '2024年9月',
    details: [
      '1ヶ月のインターンに参加しました。ソーシャルゲームのゲームクライアントのパフォーマンスチューニングに取り組みました。',
    ],
  },
  {
    company: '東京科学大学デジタル創作同好会traP',
    period: '2022年4月~現在',
    details: ['大学入学当初から加入しています。', '普段はここでゲーム制作をしています。', 'ゲーム班長や渉外担当としても活動していましたが、既に後輩に引き継いでいます。'],
  },
];

export const HOBBIES: HobbyItem[] = [
  {
    name: '謎解き',
    icon: '🔍',
    details: ['タンブルウィードによく行きます'],
    favoritesLabel:  '好きな謎解き公演',
    favorites: [
      { label: '未完', url: 'https://tumbleweed.jp/event/mikan' },
      { label: 'ROLE', url: 'https://tumbleweed.jp/event/role/'},
      { label: 'ここから先は自分の力で考えましょう。', url: 'https://www.xeoxy.com/event/ksk' },
    ]
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

export default function App({ ogpData }: { ogpData: OgpMap }) {
  const getInitialTheme = (): ThemeKey => {
    const now = new Date();
    const jst = new Date(now.getTime() + (9 * 60 + now.getTimezoneOffset()) * 60000);
    const month = jst.getMonth() + 1;

    if (month >= 4 && month <= 6) return 'spring';
    if (month >= 7 && month <= 9) return 'summer';
    if (month >= 10 && month <= 12) return 'autumn';
    return 'winter';
  };

  const [theme, setTheme] = useState<ThemeKey>(getInitialTheme);
  const [isDark, setIsDark] = useState(false);
  const config = themeConfig[theme].palettes[isDark ? 'dark' : 'light'];
  const [activeSection, setActiveSection] = useState<string>('top');

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

    const sections = NAV_SECTIONS.map((section) => document.getElementById(section.id)).filter(
      (section): section is HTMLElement => Boolean(section),
    );

    const updateActiveByCenter = () => {
      const centerY = window.innerHeight / 2;
      let closestId = sections[0]?.id ?? 'top';
      let closestDistance = Number.POSITIVE_INFINITY;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - centerY);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = section.id;
        }
      });

      setActiveSection(closestId);
    };

    updateActiveByCenter();
    window.addEventListener('scroll', updateActiveByCenter, { passive: true });
    window.addEventListener('resize', updateActiveByCenter);

    return () => {
      document.documentElement.style.scrollBehavior = '';
      window.removeEventListener('scroll', updateActiveByCenter);
      window.removeEventListener('resize', updateActiveByCenter);
    };
  }, []);

  const OgpCard = ({
    url,
    label,
    data,
    emphasis = false,
  }: {
    url: string;
    label: string;
    data?: OgpData;
    emphasis?: boolean;
  }) => {
    const baseClass = `block rounded-xl border ${config.surfaceBg} px-4 py-3 text-sm ${config.textSecondary} hover:shadow-md transition-transform hover:-translate-y-0.5`;
    const highlightClass = emphasis ? 'border-primary/60 bg-primary/5 shadow-sm' : config.surfaceBorder;
    const labelClass = emphasis ? 'text-primary font-semibold' : config.textMuted;
    const hoverTitle = isDark ? 'group-hover:text-slate-200' : 'group-hover:text-gray-700';
    const mediaBg = isDark ? 'bg-slate-800' : 'bg-gray-100';

    if (!data) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className={`${baseClass} ${highlightClass}`}>
          <span className={`font-medium ${labelClass}`}>{label}</span>
          <span className={`block text-xs ${config.textMuted} break-all`}>{url}</span>
        </a>
      );
    }

    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={`group ${baseClass} ${highlightClass} p-0`}>
        <div className="flex gap-4 p-4">
          {data.image ? (
            <img
              src={data.image}
              alt=""
              className={`h-16 w-16 rounded-lg object-cover border ${config.surfaceBorder}`}
              loading="lazy"
            />
          ) : (
            <div className={`h-16 w-16 rounded-lg ${mediaBg} border ${config.surfaceBorder}`} />
          )}
          <div className="min-w-0">
            <p className={`text-xs ${labelClass}`}>{label}</p>
            <p className={`text-sm font-semibold ${config.textPrimary} ${hoverTitle} line-clamp-2`}>
              {data.title ?? data.url}
            </p>
            <p className={`text-xs ${config.textMuted} line-clamp-2`}>
              {data.description ?? data.siteName ?? new URL(data.url).hostname}
            </p>
          </div>
        </div>
      </a>
    );
  };

  const projects: { year: string; items: ProjectItem[] }[] = [
    {
      year: '2025',
      items: [
        {
          title: 'ELEGO',
          period: '2025年4月～9月 (6か月)',
          tech: [TECH.reEngine],
          role: 'CAPCOM GAMES COMPETITIONというイベントで制作しました。ディレクター兼マネージャーとして経験者のメンバー19人をまとめ、企画～完成までを担当しました。未知のエンジン・6か月で完全締め切り・3Dアクション制作未経験という状況ながら、なんとか完成まで持っていきました。',
          genre: GENRE.game,
          playLink: { label: LABELS.play, url: 'https://gameparade.creators-guild.com/works/3532' },
          relatedLinks: [{ label: LABELS.related, url: 'https://www.capcom-games.com/cgc/2025/ja-jp/' }],
          headerImage: ElegoHeader,
          awards: ['ゲームクリエイター甲子園2025セミファイナリスト'],
        },
        {
          title: '2',
          period: '',
          tech: [],
          role: '全体構成・当日スタッフに関わりました。',
          genre: GENRE.riddle,
          playLink: { label: LABELS.ticket, url: 'https://escape.id/Clockrow-org/e-url-wo-atenaidene22222/' },
          headerImage: NiHeader,
        },
        {
          title: 'Deeper and Deeper',
          period: '2025年12月 (準備1週間, 制作1週間)',
          tech: [TECH.unity, TECH.git, TECH.vcontainer, TECH.unitask],
          role: 'リードプログラマとしてほぼ全てのプログラムを書きました。',
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
          role: 'リーダーとして参加しています。',
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
          role: 'リーダー・リードプログラマとして参加しました。',
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
          role: 'プログラマ兼チームリーダーとして、新入生への講習やサポート・レビューなどを行いながら、2日で完成させられるゲーム性の考案やプログラム制作を行いました。',
          genre: GENRE.game,
          playLink: { label: LABELS.play, url: 'https://trap.jp/post/1911/' },
          relatedLinks: [{ label: LABELS.related, url: 'https://trap.jp/post/1911/' }],
        },
        {
          title: 'Memory Transer',
          period: '2023年5月～7月 (約2か月)',
          tech: [TECH.unity, TECH.git, TECH.unirx, TECH.unitask],
          role: 'リードエンジニアとして立候補し、他メンバーへのGitやコードエディター(Rider)の講習を行い、設計からタスクの割り振りまで行いました。途中からメンバーの脱落があり、急遽集会を開くなどして完成まで持っていきました。',
          genre: GENRE.game,
          playLink: { label: LABELS.play, url: 'https://bitsummit-gamejam.itch.io/memorytranser' },
        },
        {
          title: 'バリバリベンジ',
          period: '2023年7月～現在 (約2年半)',
          tech: [TECH.unity, TECH.git, TECH.r3, TECH.unitask, TECH.feel],
          role: '企画者に誘われ、リードプログラマとして技術的な面でメンバーを引っ張りました。プログラマでない人も敵の制作ができるようにエディター拡張に特に力を入れました。中盤から元リーダーが忙しくなり、リーダーとしても活動しています。',
          genre: GENRE.game,
          playLink: { label: LABELS.play, url: 'https://gameparade.creators-guild.com/works/1559' },
          relatedLinks : [{ label: LABELS.related, url: 'https://trap.jp/post/1971/' }],
          headerImage: VariVaRevengeHeader,
          awards: ['ゲームクリエイター甲子園2024総合大賞ノミネート', 'Game^3 19th 優秀賞'],
        },
        {
          title: 'Orbit',
          period: '2023年12月 (準備1週間, 制作1週間)',
          tech: [TECH.unityUrp, TECH.git, TECH.unirx, TECH.unitask],
          role: 'メインプログラマとしてコードやGitの規約を定め、協力して設計とゲームの実装を行いました。英語版対応をしてSteamで配信しています。',
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
          role: '初心者枠として参加し、先輩の助けを借りながらプログラムを軽く書き、ゲームの仕様考案とステージ制作を主に行いました。',
          genre: GENRE.game,
          playLink: { label: LABELS.play, url: 'https://trap.jp/post/1607/' },
          relatedLinks: [{ label: LABELS.related, url: 'https://trap.jp/post/1607/' }],
          awards: ['春ハッカソン22 Emoine賞'],
        },  
        {
          title: 'Logical Room',
          period: '2022年7月～2023年11月 (1年5か月)',
          tech: [TECH.unity, TECH.git],
          role: 'プログラマとして参加し、プレイヤー挙動やゲームシステムなどのバグ修正・新規実装・リファクター・改良などを行いました。',
          genre: GENRE.game,
          playLink: { label: LABELS.play, url: 'https://trap.jp/post/2037/' },
          relatedLinks: [{ label: LABELS.related, url: 'https://trap.jp/post/2037/' }]
        },
        {
          title: 'School Breakin` Tag',
          period: '2022年11月～2023年11月 (1年)',
          tech: [TECH.unity, TECH.git, TECH.udon, TECH.vrchat],
          role: 'プロジェクト経験のあるプログラマとして初めは参加しました。しかし途中からリーダーがキャパオーバーしてしまい、サブリーダーとして制作を進行しました。他メンバーのGit周りのサポートやタスクのマネジメントなどを行いました。',
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
          role: 'プロジェクト経験のあるプログラマとしてゲームの実装を行いました。',
          genre: GENRE.game,
          playLink: { label: LABELS.play, url: 'https://trap.jp/post/1746/' },
          relatedLinks: [{ label: LABELS.related, url: 'https://trap.jp/post/1746/' }],
          awards: ['部内冬ハッカソン22 優秀賞'],
        },
      ],
    },
  ];

  const careers = CAREERS;
  const hobbies = HOBBIES;

  return (
    <div className="min-h-screen relative">
      <div
        className={`min-h-screen ${isDark ? 'dark' : ''}`}
        style={
          {
            backgroundImage: 'linear-gradient(180deg, var(--theme-from), var(--theme-to))',
            '--theme-from': config.fromColor,
            '--theme-to': config.toColor,
            transition: 'background 0.6s ease, --theme-from 0.6s ease, --theme-to 0.6s ease',
          } as React.CSSProperties
        }
      >
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute top-20 left-10 w-32 h-32 ${config.decorativeColors[0]} rounded-full blur-3xl opacity-20`}
            />
            <motion.div
              animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className={`absolute bottom-20 right-10 w-40 h-40 ${config.decorativeColors[1]} rounded-full blur-3xl opacity-20`}
            />
            <motion.div
              animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className={`absolute top-1/2 right-1/4 w-36 h-36 ${config.decorativeColors[2]} rounded-full blur-3xl opacity-20`}
            />
          </div>

          <nav className={`fixed top-0 left-0 right-0 z-50 ${config.navBg} backdrop-blur-md border-b ${config.navBorder} shadow-sm`}>
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`text-2xl font-bold ${config.textPrimary}`}
                >
                  {PROFILE.title}
                </motion.div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setIsDark((prev) => !prev)}
                    variant="outline"
                    size="icon"
                    className={`border-2 ${config.buttonOutline}`}
                    aria-label={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
                  >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                  {(Object.keys(themeConfig) as ThemeKey[]).map((t) => (
                    <Button
                      key={t}
                      onClick={() => setTheme(t)}
                      variant={theme === t ? 'default' : 'outline'}
                      size="sm"
                      className={theme === t ? config.buttonBg : `hover:bg-gray-100 ${isDark ? 'hover:bg-gray-800' : ''}`}
                    >
                      {themeConfig[t].emoji} {themeConfig[t].name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <aside className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
            {NAV_SECTIONS.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="group flex items-center justify-end gap-3"
                  aria-label={section.label}
                >
                  <span
                    className={`rounded-full border ${config.surfaceBorder} ${config.surfaceBg} px-3 py-1 text-xs font-medium ${config.textSecondary} shadow-md backdrop-blur-md transition-all duration-200 ${
                      isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                    }`}
                  >
                    {section.label}
                  </span>
                  <span
                    className={`h-3 w-3 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'bg-primary shadow-[0_0_12px_rgba(33,150,243,0.6)]'
                        : isDark
                          ? 'bg-slate-600'
                          : 'bg-gray-300'
                    } group-hover:-translate-x-2`}
                  />
                </a>
              );
            })}
          </aside>

          <section id="top" className="pt-32 pb-20 px-4 relative">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className={`text-center rounded-2xl border-2 ${config.cardBorderStatic} ${config.surfaceBg} px-6 py-10 shadow-lg backdrop-blur`}
              >
                <h2 className={`text-5xl mb-4 ${config.textPrimary}`}>About Me</h2>
                <div className="grid place-items-center gap-4 mb-6">
                  <img
                    src={avatarIcon.src}
                    alt={PROFILE.iconAlt}
                    className="h-20 w-20 rounded-full border border-white shadow-md object-cover"
                    loading="lazy"
                  />
                  <div className="flex items-center gap-3 text-3xl">
                    <span>{themeConfig[theme].emoji}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className={`border-2 ${config.surfaceBorder} ${config.surfaceBg} hover:-translate-y-0.5`}
                        onClick={() => window.open('https://x.com/dogegg314', '_blank')}
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        {LABELS.twitter}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className={`border-2 ${config.surfaceBorder} ${config.surfaceBg} hover:-translate-y-0.5`}
                        onClick={() => window.open('https://github.com/inutamago-dogegg', '_blank')}
                      >
                        <Github className="w-4 h-4 mr-2" />
                        {LABELS.github}
                      </Button>
                    </div>
                  </div>
                </div>
                <h1 className={`text-4xl md:text-5xl mb-6 ${config.textPrimary}`}>{PROFILE.name}</h1>
                <p className={`text-xl ${config.textSecondary} mb-4`}>{PROFILE.tagline}</p>
                <p className={`text-lg ${config.textMuted} mb-8`}>
                  {PROFILE.affiliation}
                  <br />
                  {PROFILE.clubs}
                </p>

                <div className="mb-8" />

                <Card className={`max-w-2xl mx-auto border-2 ${config.cardBorderStatic} ${config.surfaceBg} backdrop-blur`}>
                  <CardHeader>
                    <CardTitle className={`text-2xl ${config.textPrimary}`}>できること</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-lg ${config.textSecondary}`}>{PROFILE.skills}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>

          <section id="works" className="py-20 px-4 relative">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35 }}
                className="text-center mb-16"
              >
                <h2 className={`text-5xl mb-4 ${config.textPrimary}`}>{PROFILE.sections.worksTitle}</h2>
                <p className={`text-xl ${config.textSecondary}`}>{PROFILE.sections.worksLead}</p>
              </motion.div>

              {projects.map((yearGroup, yearIndex) => (
                <div key={yearGroup.year} className="mb-16">
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: yearIndex * 0.06 }}
                    className={`text-4xl mb-8 ${config.textPrimary} font-bold`}
                  >
                    {yearGroup.year}年度
                  </motion.h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {yearGroup.items.map((project, index) => {
                      const primaryLink = project.playLink?.url;
                      return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: index * 0.06 }}
                      >
                        <Card className={`border-2 ${config.cardBorderStatic} transition-all duration-300 ${config.surfaceBg} backdrop-blur h-full`}>
                          <CardHeader>
                            <div className="mb-2">
                              <span
                                className={`inline-flex items-center rounded-md border ${config.surfaceBorder} ${config.chipBg} px-2 py-0.5 text-xs font-medium ${config.chipText}`}
                              >
                                {project.genre}
                              </span>
                            </div>
                            <div className="flex items-start justify-between mb-2">
                              <CardTitle className={`text-xl ${config.textPrimary}`}>{project.title}</CardTitle>
                              {primaryLink && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className={isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}
                                  onClick={() => window.open(primaryLink, '_blank')}
                                >
                                  <ExternalLink className="h-5 w-5" />
                                </Button>
                              )}
                            </div>
                            <CardDescription className={`text-sm ${config.textMuted}`}>{project.period}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            {project.headerImage && primaryLink && (
                                <a
                                href={primaryLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                  className="block mb-4 transition-transform hover:-translate-y-0.5"
                                  aria-label={`${project.title} の${LABELS.play}へ移動`}
                              >
                                <img
                                  src={project.headerImage.src}
                                  alt={`${project.title} のヘッダー画像`}
                                  className={`h-44 w-full rounded-lg object-contain border ${config.surfaceBorder} ${config.surfaceBg}`}
                                  loading="lazy"
                                />
                              </a>
                            )}
                            <p className={`${config.textSecondary} mb-4`}>{project.role}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.tech.map((tech, techIndex) => (
                                <Badge key={techIndex} className={`${config.badgeBg} border`}>
                                  {tech}
                                </Badge>
                              ))}
                            </div>

                            {project.playLink && (
                              <div className="mb-4">
                                <OgpCard
                                  label={project.playLink.label}
                                  url={project.playLink.url}
                                  emphasis
                                  {...(ogpData[project.playLink.url]
                                    ? { data: ogpData[project.playLink.url] }
                                    : {})}
                                />
                              </div>
                            )}

                            {project.relatedLinks && project.relatedLinks.length > 0 && (
                              <div className="space-y-2 mb-6">
                                {project.relatedLinks.map((link) => {
                                  const ogp = ogpData[link.url];
                                  return (
                                    <OgpCard
                                      key={`${project.title}-${link.url}`}
                                      label={link.label}
                                      url={link.url}
                                      {...(ogp ? { data: ogp } : {})}
                                    />
                                  );
                                })}
                              </div>
                            )}

                            {project.awards && project.awards.length > 0 && (
                              <div className="space-y-2">
                                {project.awards.map((award, awardIndex) => (
                                  <div key={awardIndex} className={`flex items-center gap-2 text-sm ${config.textMuted}`}>
                                    <Award className="w-4 h-4 text-yellow-500" />
                                    <span>{award}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="career" className="py-20 px-4 relative">
            <div className="container mx-auto max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35 }}
                className="text-center mb-16"
              >
                <h2 className={`text-5xl mb-4 ${config.textPrimary}`}>{PROFILE.sections.careerTitle}</h2>
              </motion.div>

              <div className="space-y-4">
                {careers.map((career, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                  >
                    <Card className={`border-2 ${config.cardBorderStatic} ${config.surfaceBg} backdrop-blur transition-all duration-300`}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className={`p-3 ${config.buttonBg} rounded-lg`}>
                            <Briefcase className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className={`text-lg ${config.textPrimary}`}>{career.company}</CardTitle>
                            <CardDescription className={config.textMuted}>{career.period}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className={`space-y-2 text-sm ${config.textMuted}`}>
                          {career.details.map((detail, detailIndex) => (
                            <li key={detailIndex}>{detail}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section id="hobby" className="py-20 px-4 relative">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35 }}
                className="text-center mb-16"
              >
                <h2 className={`text-5xl mb-4 ${config.textPrimary}`}>{PROFILE.sections.hobbyTitle}</h2>
              </motion.div>

              <div className="grid gap-6">
                {hobbies.map((hobby, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                  >
                    <Card className={`border-2 ${config.cardBorderStatic} ${config.surfaceBg} backdrop-blur transition-all duration-300`}>
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">{hobby.icon}</span>
                          <CardTitle className={`text-xl ${config.textPrimary}`}>{hobby.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className={`space-y-2 text-sm ${config.textMuted}`}>
                          {hobby.details.map((detail, detailIndex) => (
                            <li key={detailIndex}>{detail}</li>
                          ))}
                        </ul>
                        {hobby.favorites && hobby.favorites.length > 0 && (
                          <div className="mt-4">
                            {hobby.favoritesLabel && (
                              <p className={`text-sm font-semibold ${config.textSecondary} mb-2`}>
                                {hobby.favoritesLabel}
                              </p>
                            )}
                            <div className="grid gap-3 sm:grid-cols-2">
                              {hobby.favorites.map((favorite) => {
                                const ogp = ogpData[favorite.url];
                                return (
                                  <OgpCard
                                    key={favorite.url}
                                    label={favorite.label}
                                    url={favorite.url}
                                    {...(ogp ? { data: ogp } : {})}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <footer className={`py-8 px-4 ${config.surfaceBg} backdrop-blur-md border-t ${config.surfaceBorder}`}>
            <div className="container mx-auto max-w-6xl text-center">
              <p className={`${config.textMuted} mb-4`}>{PROFILE.footer}</p>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('https://x.com/dogegg314', '_blank')}
                >
                  {LABELS.twitter}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('https://github.com/inutamago-dogegg', '_blank')}
                >
                  {LABELS.github}
                </Button>
              </div>
            </div>
          </footer>
      </div>
    </div>
  );
}
