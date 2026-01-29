import { useState } from 'react';
import { motion } from 'motion/react';
import { Github, ExternalLink, Award, Briefcase } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import avatarIcon from '@/images/dogegg_icon.png';
import CrossHeader from '@/images/Cross_the_C_Header.png';
import DeeperHeader from '@/images/Deeper_and_Deeper_Header.png';
import ElogoHeader from '@/images/ELEGO_Header.png';
import OrbitHeader from '@/images/Orbit_Header.png';
import QueenBeeHeader from '@/images/QueenBee_Header.png';
import VariVaRevengeHeader from '@/images/VariVaRevenge_Header.png';
import type { ImageMetadata } from 'astro';
import type { OgpData } from '@/lib/ogp';

type Season = 'spring' | 'summer' | 'autumn' | 'winter';

type ProjectLink = {
  label: string;
  url: string;
};

type ProjectItem = {
  title: string;
  period: string;
  tech: string[];
  role: string;
  playLink?: ProjectLink;
  relatedLinks?: ProjectLink[];
  headerImage?: ImageMetadata;
  awards?: string[];
};

type OgpMap = Record<string, OgpData>;

const seasonConfig = {
  spring: {
    name: '春',
    emoji: '🌸',
    fromColor: '#fdf2f8',
    toColor: '#fff1f2',
    accentColor: 'pink',
    buttonBg: 'bg-pink-500 hover:bg-pink-600',
    buttonOutline: 'border-pink-500 text-pink-600 hover:bg-pink-50',
    cardBorder: 'border-pink-200 hover:border-pink-400',
    badgeBg: 'bg-pink-100 border-pink-200 text-pink-700 hover:bg-pink-200',
    decorativeColors: ['bg-pink-300', 'bg-rose-300', 'bg-pink-200'],
  },
  summer: {
    name: '夏',
    emoji: '☀️',
    fromColor: '#eff6ff',
    toColor: '#ecfeff',
    accentColor: 'blue',
    buttonBg: 'bg-blue-500 hover:bg-blue-600',
    buttonOutline: 'border-blue-500 text-blue-600 hover:bg-blue-50',
    cardBorder: 'border-blue-200 hover:border-blue-400',
    badgeBg: 'bg-blue-100 border-blue-200 text-blue-700 hover:bg-blue-200',
    decorativeColors: ['bg-blue-300', 'bg-cyan-300', 'bg-sky-300'],
  },
  autumn: {
    name: '秋',
    emoji: '🍂',
    fromColor: '#fff7ed',
    toColor: '#fffbeb',
    accentColor: 'orange',
    buttonBg: 'bg-orange-500 hover:bg-orange-600',
    buttonOutline: 'border-orange-500 text-orange-600 hover:bg-orange-50',
    cardBorder: 'border-orange-200 hover:border-orange-400',
    badgeBg: 'bg-orange-100 border-orange-200 text-orange-700 hover:bg-orange-200',
    decorativeColors: ['bg-orange-300', 'bg-amber-300', 'bg-yellow-300'],
  },
  winter: {
    name: '冬',
    emoji: '❄️',
    fromColor: '#f8fafc',
    toColor: '#eff6ff',
    accentColor: 'slate',
    buttonBg: 'bg-slate-600 hover:bg-slate-700',
    buttonOutline: 'border-slate-600 text-slate-600 hover:bg-slate-50',
    cardBorder: 'border-slate-200 hover:border-slate-400',
    badgeBg: 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200',
    decorativeColors: ['bg-slate-300', 'bg-blue-300', 'bg-slate-200'],
  },
};

function OgpCard({
  url,
  label,
  data,
  emphasis = false,
}: {
  url: string;
  label: string;
  data?: OgpData;
  emphasis?: boolean;
}) {
  const baseClass =
    'block rounded-xl border bg-white/90 px-4 py-3 text-sm text-gray-700 hover:shadow-md transition';
  const highlightClass = emphasis
    ? 'border-primary/60 bg-primary/5 shadow-sm'
    : 'border-gray-200';
  const labelClass = emphasis ? 'text-primary font-semibold' : 'text-gray-500';

  if (!data) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} ${highlightClass}`}
      >
        <span className={`font-medium ${labelClass}`}>{label}</span>
        <span className="block text-xs text-gray-500 break-all">{url}</span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group ${baseClass} ${highlightClass} p-0`}
    >
      <div className="flex gap-4 p-4">
        {data.image ? (
          <img
            src={data.image}
            alt=""
            className="h-16 w-16 rounded-lg object-cover border border-gray-200"
            loading="lazy"
          />
        ) : (
          <div className="h-16 w-16 rounded-lg bg-gray-100 border border-gray-200" />
        )}
        <div className="min-w-0">
          <p className={`text-xs ${labelClass}`}>{label}</p>
          <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 line-clamp-2">
            {data.title ?? data.url}
          </p>
          <p className="text-xs text-gray-500 line-clamp-2">
            {data.description ?? data.siteName ?? new URL(data.url).hostname}
          </p>
        </div>
      </div>
    </a>
  );
}

export default function App({ ogpData }: { ogpData: OgpMap }) {
  const [season, setSeason] = useState<Season>('spring');
  const config = seasonConfig[season];

  const projects: { year: string; items: ProjectItem[] }[] = [
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
    {
      year: '2024',
      items: [
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
  ];

  const careers = [
    { period: '2025年2月～3月', company: 'GREE Jobs' },
    { period: '2024年9月', company: 'CA Tech Job' },
    { period: '2022年4月～現在', company: '東京科学大学デジタル創作同好会traP' },
    { period: '2025年7月～現在', company: 'C-lock-row' },
  ];

  const hobbies = [
    { name: 'ゲーム制作', description: '短いプロトタイプで遊び心地を検証します', icon: '🛠️' },
    { name: 'ゲームプレイ', description: '体験設計を観察しながら幅広く遊びます', icon: '🎮' },
    { name: '謎解き', description: '仕掛けや導線の作り方に興味があります', icon: '🔍' },
  ];

  return (
    <div className="min-h-screen relative">
      <div
        className="min-h-screen"
        style={
          {
            backgroundImage: 'linear-gradient(180deg, var(--season-from), var(--season-to))',
            '--season-from': config.fromColor,
            '--season-to': config.toColor,
            transition: 'background 0.6s ease, --season-from 0.6s ease, --season-to 0.6s ease',
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

          <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-2xl font-bold text-gray-900"
                >
                  どぐえぐ Portfolio
                </motion.div>

                <div className="flex gap-2">
                  {(Object.keys(seasonConfig) as Season[]).map((s) => (
                    <Button
                      key={s}
                      onClick={() => setSeason(s)}
                      variant={season === s ? 'default' : 'outline'}
                      size="sm"
                      className={season === s ? config.buttonBg : 'hover:bg-gray-100'}
                    >
                      {seasonConfig[s].emoji} {seasonConfig[s].name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <section className="pt-32 pb-20 px-4 relative">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="text-center"
              >
                <div className="flex justify-center items-center gap-4 mb-6">
                  <img
                    src={avatarIcon.src}
                    alt="どぐえぐのアイコン"
                    className="h-20 w-20 rounded-full border border-white shadow-md object-cover"
                    loading="lazy"
                  />
                  <span className="text-5xl">{config.emoji}</span>
                </div>
                <h1 className="text-5xl md:text-6xl mb-6 text-gray-900">どぐえぐ</h1>
                <p className="text-xl text-gray-700 mb-4">
                  持っている力を使って面白いゲームを作り出すのが好きです
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  東京科学大学 情報理工学院 数理・計算科学系 学士3年
                  <br />
                  東京科学大学デジタル創作同好会traP / C-lock-row
                </p>

                <div className="flex gap-4 justify-center mb-8">
                  <Button
                    size="lg"
                    className={`${config.buttonBg} text-white shadow-lg`}
                    onClick={() => window.open('https://x.com/dogegg314', '_blank')}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Twitter
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className={`border-2 ${config.buttonOutline}`}
                    onClick={() => window.open('https://github.com/inutamago-dogegg', '_blank')}
                  >
                    <Github className="w-5 h-5 mr-2" />
                    GitHub
                  </Button>
                </div>

                <Card className={`max-w-2xl mx-auto border-2 ${config.cardBorder} bg-white/90 backdrop-blur`}>
                  <CardHeader>
                    <CardTitle className="text-2xl">できること</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-gray-700">Unity, C#を使ってゲーム制作をしています</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>

          <section className="py-20 px-4 relative">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl mb-4 text-gray-900">成果物</h2>
                <p className="text-xl text-gray-700">これまでに制作したゲームプロジェクト</p>
              </motion.div>

              {projects.map((yearGroup, yearIndex) => (
                <div key={yearGroup.year} className="mb-16">
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: yearIndex * 0.06 }}
                    className="text-3xl mb-8 text-gray-900 font-bold"
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
                        whileHover={{ y: -8 }}
                      >
                        <Card className={`border-2 ${config.cardBorder} transition-all duration-300 hover:shadow-xl bg-white/90 backdrop-blur h-full`}>
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <CardTitle className="text-xl text-gray-900">{project.title}</CardTitle>
                              {primaryLink && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="hover:bg-gray-100"
                                  onClick={() => window.open(primaryLink, '_blank')}
                                >
                                  <ExternalLink className="h-5 w-5" />
                                </Button>
                              )}
                            </div>
                            <CardDescription className="text-sm text-gray-500">{project.period}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            {project.headerImage && primaryLink && (
                              <a
                                href={primaryLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block mb-4"
                                aria-label={`${project.title} のプレイリンクへ移動`}
                              >
                                <img
                                  src={project.headerImage.src}
                                  alt={`${project.title} のヘッダー画像`}
                                  className="h-44 w-full rounded-lg object-contain border border-gray-200 bg-white"
                                  loading="lazy"
                                />
                              </a>
                            )}
                            <p className="text-gray-700 mb-4">{project.role}</p>

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
                                  <div key={awardIndex} className="flex items-center gap-2 text-sm text-gray-600">
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

          <section className="py-20 px-4 relative">
            <div className="container mx-auto max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl mb-4 text-gray-900">キャリア・インターン</h2>
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
                    <Card className={`border-2 ${config.cardBorder} bg-white/90 backdrop-blur hover:shadow-lg transition-all duration-300`}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className={`p-3 ${config.buttonBg} rounded-lg`}>
                            <Briefcase className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-gray-900">{career.company}</CardTitle>
                            <CardDescription>{career.period}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 px-4 relative">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl mb-4 text-gray-900">趣味</h2>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                {hobbies.map((hobby, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className={`border-2 ${config.cardBorder} bg-white/90 backdrop-blur hover:shadow-lg transition-all duration-300`}>
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">{hobby.icon}</span>
                          <CardTitle className="text-xl text-gray-900">{hobby.name}</CardTitle>
                        </div>
                        <CardDescription className="text-base">{hobby.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <footer className="py-8 px-4 bg-white/80 backdrop-blur-md border-t border-gray-200">
            <div className="container mx-auto max-w-6xl text-center">
              <p className="text-gray-600 mb-4">© 2026 どぐえぐ Portfolio. All rights reserved.</p>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('https://x.com/dogegg314', '_blank')}
                >
                  Twitter
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('https://github.com/inutamago-dogegg', '_blank')}
                >
                  GitHub
                </Button>
              </div>
            </div>
          </footer>
      </div>
    </div>
  );
}
