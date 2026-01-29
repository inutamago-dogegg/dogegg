import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, ExternalLink, Award, Briefcase } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

type Season = 'spring' | 'summer' | 'autumn' | 'winter';

const seasonConfig = {
  spring: {
    name: '春',
    emoji: '🌸',
    bgGradient: 'from-pink-50 to-rose-50',
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
    bgGradient: 'from-blue-50 to-cyan-50',
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
    bgGradient: 'from-orange-50 to-amber-50',
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
    bgGradient: 'from-slate-50 to-blue-50',
    accentColor: 'slate',
    buttonBg: 'bg-slate-600 hover:bg-slate-700',
    buttonOutline: 'border-slate-600 text-slate-600 hover:bg-slate-50',
    cardBorder: 'border-slate-200 hover:border-slate-400',
    badgeBg: 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200',
    decorativeColors: ['bg-slate-300', 'bg-blue-300', 'bg-slate-200'],
  },
};

export default function App() {
  const [season, setSeason] = useState<Season>('spring');
  const config = seasonConfig[season];

  const projects = [
    {
      year: '2022',
      items: [
        {
          title: 'つかまらないで！ゆうちゃん',
          period: '2022年6月',
          tech: ['Unity', 'Git'],
          description: '初心者枠として参加し、ゲームの仕様考案とステージ制作を主に行いました。',
          link: 'https://trap.jp/post/1607/',
          awards: ['春ハッカソン22 Emoine賞'],
        },
        {
          title: 'Logical Room',
          period: '2022年7月～2023年11月',
          tech: ['Unity', 'Git'],
          description: 'プログラマとして、プレイヤー挙動やゲームシステムのバグ修正・新規実装を行いました。',
          link: 'https://trap.jp/post/2037/',
        },
        {
          title: 'School Breakin` Tag',
          period: '2022年11月～2023年11月',
          tech: ['Unity', 'Git', 'Udon#', 'VRChat'],
          description: 'サブリーダーとして制作を進行。Git周りのサポートやタスク管理を行いました。',
          link: 'https://vrchat.com/home/launch?worldId=wrld_5fddc89d-6c2f-4208-8873-038ea25f80c5&instanceType=friend+',
          awards: ['IVRC2024メタバース部門 Unity賞'],
        },
        {
          title: 'Root Shooter',
          period: '2022年12月',
          tech: ['Unity', 'Git', 'PUN2'],
          description: 'プロジェクト経験のあるプログラマとしてゲームの実装を行いました。',
          link: 'https://trap.jp/post/1746/',
          awards: ['部内冬ハッカソン22 優秀賞'],
        },
      ],
    },
    {
      year: '2023',
      items: [
        {
          title: '「」か？',
          period: '2023年6月',
          tech: ['Unity', 'Git'],
          description: 'プログラマ兼チームリーダーとして、新入生への講習やサポートを行いました。',
          link: 'https://trap.jp/post/1911/',
        },
        {
          title: 'Memory Transer',
          period: '2023年5月～7月',
          tech: ['Unity', 'Git', 'UniRx', 'UniTask'],
          description: 'リードエンジニアとして、設計からタスクの割り振りまで行いました。',
          link: 'https://bitsummit-gamejam.itch.io/memorytranser',
        },
        {
          title: 'バリバリベンジ',
          period: '2023年7月～現在',
          tech: ['Unity', 'Git', 'R3', 'UniTask', 'Feel'],
          description: 'リードプログラマとして技術的な面でメンバーを引っ張りました。エディター拡張に特に力を入れました。',
          link: 'https://gameparade.creators-guild.com/works/1559',
          awards: ['ゲームクリエイター甲子園2024総合大賞ノミネート', 'Game^3 19th 優秀賞'],
        },
        {
          title: 'Orbit',
          period: '2023年12月',
          tech: ['Unity URP', 'Git', 'UniRx', 'UniTask'],
          description: 'メインプログラマとしてコードやGitの規約を定め、協力して設計と実装を行いました。',
          link: 'https://store.steampowered.com/app/2990710/Orbit/',
          awards: ['部内冬ハッカソン23 最優秀賞'],
        },
      ],
    },
    {
      year: '2024',
      items: [
        {
          title: 'Cross the C',
          period: '2024年7月～現在',
          tech: ['Unity URP', 'Git', 'R3', 'UniTask', 'VContainer'],
          description: 'リーダーとして参加しています。',
          link: 'https://gameparade.creators-guild.com/works/2763',
          awards: ['ゲームクリエイター甲子園2024総合大賞ノミネート', 'ゲームクリエイター甲子園2025総合大賞ノミネート'],
        },
      ],
    },
    {
      year: '2025',
      items: [
        {
          title: 'Queen Bee',
          period: '2025年1月',
          tech: ['Unity', 'Git', 'UniTask'],
          description: 'リーダー・リードプログラマとして参加しました。',
          link: 'https://unityroom.com/games/queenbee',
        },
        {
          title: 'ELEGO',
          period: '2025年4月～9月',
          tech: ['RE Engine'],
          description: 'ディレクター兼マネージャーとして経験者のメンバー19人をまとめ、企画～完成までを担当しました。',
          link: 'https://gameparade.creators-guild.com/works/3532',
          awards: ['ゲームクリエイター甲子園2025セミファイナリスト'],
        },
        {
          title: 'Deeper and Deeper',
          period: '2025年12月',
          tech: ['Unity', 'Git', 'VContainer', 'UniTask'],
          description: 'リードプログラマとしてほぼ全てのプログラムを書きました。',
          link: 'https://unityroom.com/games/deeper_and_deeper',
        },
      ],
    },
  ];

  const careers = [
    { period: '2025年2月～3月', company: 'GREE Jobs' },
    { period: '2024年9月', company: 'CA Tech Job' },
    { period: '2022年4月～現在', company: '東京科学大学デジタル創作同好会traP' },
  ];

  const hobbies = [
    { name: '謎解き', description: 'タンブルウィードによく行きます', icon: '🔍' },
    { name: '漫画', description: 'ジャンプラ購読してます', icon: '📚' },
    { name: 'ゲーム(遊ぶ方)', description: 'AAAよりインディーゲームの方をよく遊びます', icon: '🎮' },
    { name: 'ゲーム(つくる方)', description: 'Unity, C#を使います', icon: '💻' },
  ];

  return (
    <div className="min-h-screen relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={season}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`min-h-screen bg-gradient-to-b ${config.bgGradient}`}
        >
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute top-20 left-10 w-32 h-32 ${config.decorativeColors[0]} rounded-full blur-3xl opacity-20`}
            />
            <motion.div
              animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className={`absolute bottom-20 right-10 w-40 h-40 ${config.decorativeColors[1]} rounded-full blur-3xl opacity-20`}
            />
            <motion.div
              animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className={`absolute top-1/2 right-1/4 w-36 h-36 ${config.decorativeColors[2]} rounded-full blur-3xl opacity-20`}
            />
          </div>

          <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
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
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <div className="inline-block mb-6 text-6xl">{config.emoji}</div>
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
                transition={{ duration: 0.6 }}
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
                    transition={{ duration: 0.6, delay: yearIndex * 0.1 }}
                    className="text-3xl mb-8 text-gray-900 font-bold"
                  >
                    {yearGroup.year}年度
                  </motion.h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {yearGroup.items.map((project, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ y: -8 }}
                      >
                        <Card className={`border-2 ${config.cardBorder} transition-all duration-300 hover:shadow-xl bg-white/90 backdrop-blur h-full`}>
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <CardTitle className="text-xl text-gray-900">{project.title}</CardTitle>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="hover:bg-gray-100"
                                onClick={() => window.open(project.link, '_blank')}
                              >
                                <ExternalLink className="h-5 w-5" />
                              </Button>
                            </div>
                            <CardDescription className="text-sm text-gray-500">{project.period}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700 mb-4">{project.description}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.tech.map((tech, techIndex) => (
                                <Badge key={techIndex} className={`${config.badgeBg} border`}>
                                  {tech}
                                </Badge>
                              ))}
                            </div>

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
                    ))}
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
                transition={{ duration: 0.6 }}
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
                    transition={{ duration: 0.6, delay: index * 0.1 }}
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
                transition={{ duration: 0.6 }}
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
                    transition={{ duration: 0.6, delay: index * 0.1 }}
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
