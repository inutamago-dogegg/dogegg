import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Github, Award, Briefcase, Sun, Moon, Home, FolderOpen, User, Users, Trophy } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  CAREERS,
  HOBBIES,
  LABELS,
  ABOUT_NAV_SECTIONS,
  PROJECTS,
  PROFILE,
  SKILLS,
  type ProjectItem,
} from '@/data/content';
import avatarIcon from '@/images/dogegg_icon.png';
import steamIcon from '@/images/Steam_icon_logo.svg';
import type { OgpData } from '@/lib/ogp';

type ThemeKey = 'spring' | 'summer' | 'autumn' | 'winter';

type OgpMap = Record<string, OgpData>;

const themeConfig = {
  spring: {
    name: '',
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
    name: '',
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
    name: '',
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
    name: '',
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

export default function App({
  ogpData,
  mode = 'home',
}: {
  ogpData: OgpMap;
  mode?: 'home' | 'about' | 'works';
}) {
  const isHomePage = mode === 'home';
  const isAboutPage = mode === 'about';
  const isWorksPage = mode === 'works';
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
  const worksNavSections = useMemo(
    () =>
      PROJECTS.map((group) => ({
        id: `works-${group.year}`,
        label: `${group.year}年度`,
      })),
    [],
  );
  const navSections = useMemo(
    () => (isAboutPage ? ABOUT_NAV_SECTIONS : isWorksPage ? worksNavSections : []),
    [isAboutPage, isWorksPage, worksNavSections],
  );
  const [activeSection, setActiveSection] = useState<string>(
    navSections[0]?.id ?? (isWorksPage ? worksNavSections[0]?.id ?? 'works' : 'home'),
  );
  const [openYears, setOpenYears] = useState<Record<string, boolean>>(() => {
    const years = PROJECTS.map((group) => Number(group.year)).filter((value) => !Number.isNaN(value));
    const latestYear = years.length > 0 ? Math.max(...years) : null;
    return Object.fromEntries(
      PROJECTS.map((group) => [group.year, Number(group.year) === latestYear]),
    );
  });

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

    if (navSections.length === 0) {
      setActiveSection(isWorksPage ? worksNavSections[0]?.id ?? 'works' : 'home');
      return;
    }

    const sections = navSections.map((section) => document.getElementById(section.id)).filter(
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
  }, [isWorksPage, navSections, worksNavSections]);

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
    const baseClass = `block rounded-xl border ${config.surfaceBg} px-4 py-3 text-sm ${config.textSecondary} hover:shadow-md transition-transform hover:-translate-y-0.5 break-words min-w-0`;
    const highlightClass = emphasis ? 'border-primary/60 bg-primary/5 shadow-sm' : config.surfaceBorder;
    const labelClass = emphasis ? 'text-primary font-semibold' : config.textMuted;
    const hoverTitle = isDark ? 'group-hover:text-slate-200' : 'group-hover:text-gray-700';
    const mediaBg = isDark ? 'bg-slate-800' : 'bg-gray-100';

    if (!data) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${baseClass} ${highlightClass}`}
          title={url}
        >
          <span className={`font-medium ${labelClass}`}>{label}</span>
          <span className={`block text-xs ${config.textMuted} break-all`}>{url}</span>
        </a>
      );
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`group ${baseClass} ${highlightClass} p-0`}
        title={url}
      >
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



  const projects = PROJECTS;
  const careers = CAREERS;
  const hobbies = HOBBIES;
  const skills = SKILLS;
  const allProjects = PROJECTS.flatMap((group) => group.items);
  const featuredOrder = ['Cross the C', 'ELEGO', 'Orbit', 'バリバリベンジ'];
  const featuredProjects = featuredOrder
    .map((title) => allProjects.find((project) => project.title === title))
    .filter((project): project is ProjectItem => Boolean(project));
  const baseUrl = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const homeUrl = `${baseUrl}home/`;
  const aboutUrl = `${baseUrl}about/`;
  const worksPageUrl = `${baseUrl}works/`;
  const navGhostClass = `${config.textSecondary} ${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`;
  const staticButtonBg = config.buttonBg
    .split(' ')
    .filter((item) => !item.startsWith('hover:'))
    .join(' ');
  const renderProjectCard = (project: ProjectItem, index: number, key: string) => {
    const primaryLink = project.playLink?.url;
    const xUrl = project.xUrl;
    const githubUrl = project.githubUrl;
    const steamUrl = project.steamUrl;

    return (
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: index * 0.06 }}
        className="min-w-0"
      >
        <Card className={`border-2 ${config.cardBorderStatic} transition-all duration-300 ${config.surfaceBg} backdrop-blur h-full min-w-0`}>
          <CardHeader>
            <div className="mb-2">
              <span
                className={`inline-flex items-center rounded-md border ${config.surfaceBorder} ${config.chipBg} px-2 py-0.5 text-xs font-medium ${config.chipText}`}
              >
                {project.genre}
              </span>
            </div>
            <div className="mb-2 min-w-0">
              <CardTitle className={`text-xl ${config.textPrimary} break-words`}>
                {project.title}
              </CardTitle>
            </div>
            <CardDescription className={`text-sm ${config.textMuted}`}>{project.period}</CardDescription>
          </CardHeader>
          <CardContent className="min-w-0">
            {project.headerImage && (
              <div className="relative mb-4">
                {primaryLink ? (
                  <a
                    href={primaryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transition-transform hover:-translate-y-0.5"
                    aria-label={`${project.title} の${LABELS.play}へ移動`}
                    title={primaryLink}
                  >
                    <img
                      src={project.headerImage.src}
                      alt={`${project.title} のヘッダー画像`}
                      className={`h-44 w-full rounded-lg object-contain border ${config.surfaceBorder} ${config.surfaceBg}`}
                      loading="lazy"
                    />
                  </a>
                ) : (
                  <img
                    src={project.headerImage.src}
                    alt={`${project.title} のヘッダー画像`}
                    className={`h-44 w-full rounded-lg object-contain border ${config.surfaceBorder} ${config.surfaceBg}`}
                    loading="lazy"
                  />
                )}
                {(xUrl || githubUrl || steamUrl) && (
                  <div className="absolute left-2 bottom-2 flex items-center gap-1">
                    {xUrl && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`${config.surfaceBg} ${config.surfaceBorder} border shadow-sm ${
                          isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => window.open(xUrl, '_blank')}
                        aria-label="X"
                        title={xUrl}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </Button>
                    )}
                    {githubUrl && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`${config.surfaceBg} ${config.surfaceBorder} border shadow-sm ${
                          isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => window.open(githubUrl, '_blank')}
                        aria-label={LABELS.github}
                        title={githubUrl}
                      >
                        <Github className="h-4 w-4" />
                      </Button>
                    )}
                    {steamUrl && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`${config.surfaceBg} ${config.surfaceBorder} border shadow-sm ${
                          isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => window.open(steamUrl, '_blank')}
                        aria-label="Steam"
                        title={steamUrl}
                      >
                        <span className="relative inline-flex">
                          <img src={steamIcon.src} alt="" className="h-4 w-4" />
                          <span className="absolute -top-2 -right-2 text-[14px] leading-none">®</span>
                        </span>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
            {!project.headerImage && (xUrl || githubUrl || steamUrl) && (
              <div className="flex items-center gap-1 mb-4">
                {xUrl && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className={isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}
                    onClick={() => window.open(xUrl, '_blank')}
                    aria-label="X"
                    title={xUrl}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </Button>
                )}
                {githubUrl && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className={isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}
                    onClick={() => window.open(githubUrl, '_blank')}
                    aria-label={LABELS.github}
                    title={githubUrl}
                  >
                    <Github className="h-4 w-4" />
                  </Button>
                )}
                {steamUrl && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className={isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}
                    onClick={() => window.open(steamUrl, '_blank')}
                    aria-label="Steam"
                    title={steamUrl}
                  >
                    <span className="relative inline-flex">
                      <img src={steamIcon.src} alt="" className="h-4 w-4" />
                      <span className="absolute -top-2 -right-2 text-[14px] leading-none">®</span>
                    </span>
                  </Button>
                )}
              </div>
            )}
            <div className="space-y-3 mb-4">
              {project.member && (
                <div>
                  <p className={`text-xs font-semibold ${config.textMuted}`}>メンバー</p>
                  <p className={`text-sm ${config.textSecondary} break-words`}>{project.member}</p>
                </div>
              )}
              {project.outline && (
                <div>
                  <p className={`text-xs font-semibold ${config.textMuted}`}>概要</p>
                  <p className={`text-sm ${config.textSecondary} break-words`}>{project.outline}</p>
                </div>
              )}
              {project.appeal && (
                <div>
                  <p className={`text-xs font-semibold ${config.textMuted}`}>やったこと</p>
                  <p className={`text-sm ${config.textSecondary} break-words`}>{project.appeal}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((tech, techIndex) => (
                <Badge variant="static" key={techIndex} className={`${config.badgeBg} pointer-events-none`}>
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
  };
  const getCareerIcon = (category: (typeof CAREERS)[number]['category']) => {
    switch (category) {
      case 'サークル':
        return Users;
      case 'インターン':
        return Briefcase;
      case 'イベント':
        return Trophy;
      default:
        return Briefcase;
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
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
              className={`absolute top-20 left-10 w-32 h-32 ${config.decorativeColors[0]} rounded-full blur-3xl opacity-20 transform-gpu`}
              style={{ willChange: 'transform' }}
            />
            <motion.div
              animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className={`absolute bottom-20 right-10 w-40 h-40 ${config.decorativeColors[1]} rounded-full blur-3xl opacity-20 transform-gpu`}
              style={{ willChange: 'transform' }}
            />
            <motion.div
              animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className={`absolute top-1/2 right-1/4 w-36 h-36 ${config.decorativeColors[2]} rounded-full blur-3xl opacity-20 transform-gpu`}
              style={{ willChange: 'transform' }}
            />
          </div>

          <nav className={`fixed top-0 left-0 right-0 z-50 ${config.navBg} backdrop-blur-md border-b ${config.navBorder} shadow-sm`}>
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <a
                    href={isWorksPage ? '#works' : '#top'}
                    className={`text-2xl font-bold ${config.textPrimary} whitespace-nowrap`}
                    title={isWorksPage ? '#works' : '#top'}
                  >
                    {PROFILE.title}
                  </a>
                </motion.div>

                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center gap-0">
                    <Button
                      asChild
                      variant={isHomePage ? 'default' : 'ghost'}
                      size="sm"
                      className={`${isHomePage ? config.buttonBg : navGhostClass} gap-1 px-2`}
                    >
                      <a href={homeUrl}>
                        <Home className="w-4 h-4 mr-0" />
                        Home
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant={isAboutPage ? 'default' : 'ghost'}
                      size="sm"
                      className={`${isAboutPage ? config.buttonBg : navGhostClass} gap-1 px-2`}
                    >
                      <a href={aboutUrl}>
                        <User className="w-4 h-4 mr-0" />
                        About
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant={isWorksPage ? 'default' : 'ghost'}
                      size="sm"
                      className={`${isWorksPage ? config.buttonBg : navGhostClass} gap-1 px-2`}
                    >
                      <a href={worksPageUrl}>
                        <FolderOpen className="w-4 h-4 mr-0" />
                        Works
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {navSections.length > 0 && (
            <aside className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
              {navSections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group flex items-center justify-end gap-3"
                    aria-label={section.label}
                    title={`#${section.id}`}
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
          )}

          {isHomePage && (
          <section className="min-h-screen flex items-center justify-center px-4 relative">
            <div className="container mx-auto max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="text-center"
              >
                <div className="relative inline-block mb-8">
                  <img
                    src={avatarIcon.src}
                    alt={PROFILE.iconAlt}
                    className={`h-28 w-28 md:h-36 md:w-36 rounded-full border-2 ${config.surfaceBorder} shadow-lg object-cover`}
                    loading="lazy"
                  />
                  <span
                    className={`absolute top-[33%] left-1/2 -translate-x-1/2 rounded-ful px-2 py-0.5 text-xl md:text-base`}
                    aria-hidden="true"
                  >
                    {themeConfig[theme].emoji}
                  </span>
                </div>
                <h1 className={`text-5xl md:text-6xl mb-6 ${config.textPrimary}`}>{PROFILE.title}</h1>
                <p className={`text-xl md:text-2xl ${config.textSecondary} mb-10`}>{PROFILE.tagline}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                  <Button
                    asChild
                    size="lg"
                    className={`${config.buttonBg} text-white shadow-lg text-lg py-6`}
                  >
                    <a href={aboutUrl}>About</a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className={`${config.buttonBg} text-white shadow-lg text-lg py-6`}
                  >
                    <a href={worksPageUrl}>Works</a>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
          )}

          {isAboutPage && (
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
                        title="https://x.com/dogegg314"
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
                        title="https://github.com/inutamago-dogegg"
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
              </motion.div>
            </div>
          </section>
          )}

          {isAboutPage && (
          <section id="skills" className="py-20 px-4 relative">
            <div className="container mx-auto max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35 }}
                className="text-center mb-16"
              >
                <h2 className={`text-5xl mb-4 ${config.textPrimary}`}>{PROFILE.sections.skillsTitle}</h2>
                <p className={`text-xl ${config.textSecondary}`}>{PROFILE.sections.skillsLead}</p>
              </motion.div>

              <div className="grid gap-6 sm:grid-cols-2">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                  >
                    <Card className={`border-2 ${config.cardBorderStatic} ${config.surfaceBg} backdrop-blur transition-all duration-300 h-full`}>
                      <CardHeader>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={skill.icon.src}
                              alt={`${skill.name} のアイコン`}
                              className="h-8 w-8 rounded-md object-contain"
                              loading="lazy"
                            />
                            <CardTitle className={`text-xl ${config.textPrimary}`}>{skill.name}</CardTitle>
                          </div>
                          <span className={`text-sm font-semibold ${config.textSecondary}`}>{'★'.repeat(skill.level)}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className={`text-sm ${config.textSecondary}`}>{skill.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          )}

          {isAboutPage && (
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
                <p className={`text-xl ${config.textSecondary}`}>{PROFILE.sections.careerLead}</p>
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
                        <div className="flex items-end gap-4">
                          <div className="flex flex-col items-center gap-2">
                            <Badge variant="static" className={`${config.badgeBg} pointer-events-none`}>
                              {career.category}
                            </Badge>
                            <div className={`p-3 ${staticButtonBg} rounded-lg`}>
                              {(() => {
                                const Icon = getCareerIcon(career.category);
                                return <Icon className="w-6 h-6 text-white" />;
                              })()}
                            </div>
                          </div>
                          <div className="min-w-0">
                            {career.url ? (
                              <CardTitle className={`text-xl md:text-1xl ${config.textPrimary}`}>
                                <a
                                  href={career.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                  title={career.url}
                                >
                                  {career.company}
                                </a>
                              </CardTitle>
                            ) : (
                              <CardTitle className={`text-xl md:text-1xl ${config.textPrimary}`}>
                                {career.company}
                              </CardTitle>
                            )}
                            <CardDescription className={config.textMuted}>{career.period}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className={`space-y-2 text-sm ${config.textSecondary}`}>
                          {career.details.map((detail, detailIndex) => (
                            <li key={detailIndex}>{detail}</li>
                          ))}
                        </ul>
                        {career.tech && career.tech.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {career.tech.map((tech, techIndex) => (
                              <Badge variant="static" key={techIndex} className={`${config.badgeBg} pointer-events-none`}>
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          )}

          {isAboutPage && (
          <section id="featured" className="py-20 px-4 relative">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35 }}
                className="text-center mb-16"
              >
                <h2 className={`text-5xl mb-4 ${config.textPrimary}`}>{PROFILE.sections.featuredTitle}</h2>
                <p className={`text-xl ${config.textSecondary}`}>{PROFILE.sections.featuredLead}</p>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-2">
                {featuredProjects.map((project, index) =>
                  renderProjectCard(project, index, `featured-${project.title}-${index}`),
                )}
              </div>
              <div className="mt-10 flex justify-center">
                <Button
                  asChild
                  variant="outline"
                  className={`border-2 ${config.buttonOutline} w-full max-w-2xl`}
                >
                  <a href={worksPageUrl}>全ての制作物を見る</a>
                </Button>
              </div>
            </div>
          </section>
          )}

          {isWorksPage && (
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
                <div key={yearGroup.year} id={`works-${yearGroup.year}`} className="mb-16">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: yearIndex * 0.06 }}
                    className="flex items-center justify-between mb-8 gap-4"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenYears((prev) => ({ ...prev, [yearGroup.year]: !prev[yearGroup.year] }))
                      }
                      className={`text-left text-4xl ${config.textPrimary} font-bold whitespace-nowrap inline-flex items-center gap-2 transition-all duration-200 hover:opacity-90 hover:scale-[1.03] hover:-translate-y-0.5`}
                      aria-expanded={openYears[yearGroup.year]}
                      aria-controls={`projects-${yearGroup.year}`}
                    >
                      {yearGroup.year}年度
                      <span
                        className={`text-2xl transition-transform ${
                          openYears[yearGroup.year] ? 'rotate-180' : 'rotate-0'
                        }`}
                        aria-hidden="true"
                      >
                        ▼
                      </span>
                    </button>
                  </motion.div>

                  <motion.div
                    id={`projects-${yearGroup.year}`}
                    initial={false}
                    animate={{
                      height: openYears[yearGroup.year] ? 'auto' : 0,
                      opacity: openYears[yearGroup.year] ? 1 : 0,
                    }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      {yearGroup.items.map((project, index) =>
                        renderProjectCard(project, index, `${yearGroup.year}-${project.title}-${index}`),
                      )}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </section>
          )}

          {isAboutPage && (
          <section id="hobby" className="py-20 px-4 relative overflow-x-hidden">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35 }}
                className="text-center mb-16"
              >
                <h2 className={`text-5xl mb-4 ${config.textPrimary}`}>{PROFILE.sections.hobbyTitle}</h2>
                <p className={`text-xl ${config.textSecondary}`}>{PROFILE.sections.hobbyLead}</p>
              </motion.div>

              <div className="grid gap-6">
                {hobbies.map((hobby, index) => (
                  <motion.div
                    className='min-w-0'
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                  >
                    <Card className={`min-w-0 border-2 ${config.cardBorderStatic} ${config.surfaceBg} backdrop-blur transition-all duration-300`}>
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">{hobby.icon}</span>
                          <CardTitle className={`text-xl ${config.textPrimary}`}>{hobby.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className={`space-y-2 text-sm ${config.textSecondary}`}>
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
                            <div className="grid gap-3 sm:grid-cols-2 min-w-0">
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
          )}

          <footer className={`py-8 px-4 ${config.surfaceBg} backdrop-blur-md border-t ${config.surfaceBorder}`}>
            <div className="container mx-auto max-w-6xl text-center">
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <Button
                  size="icon"
                  variant="ghost"
                  className={`${config.textMuted} border ${config.surfaceBorder} ${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
                  onClick={() => window.open('https://x.com/dogegg314', '_blank')}
                  aria-label={LABELS.twitter}
                  title="https://x.com/dogegg314"
                >
                  <svg className="w-4 h-4 text-current" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`${config.textMuted} border ${config.surfaceBorder} ${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
                  onClick={() => window.open('https://github.com/inutamago-dogegg', '_blank')}
                  aria-label={LABELS.github}
                  title="https://github.com/inutamago-dogegg"
                >
                  <Github className="w-4 h-4 text-current" />
                </Button>
                <Button
                  onClick={() => setIsDark((prev) => !prev)}
                  variant="outline"
                  size="icon"
                  className={`border-2 ${config.buttonOutline}`}
                  aria-label={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-thin pr-1">
                  {(Object.keys(themeConfig) as ThemeKey[]).map((t) => (
                    <Button
                      key={t}
                      onClick={() => setTheme(t)}
                      variant={theme === t ? 'default' : 'outline'}
                      size="sm"
                      className={`${theme === t ? config.buttonBg : `hover:bg-gray-100 ${isDark ? 'hover:bg-gray-800' : ''}`} shrink-0`}
                    >
                      {themeConfig[t].emoji} {themeConfig[t].name}
                    </Button>
                  ))}
                </div>
              </div>
              <p className={`${config.textMuted} mb-4`}>{PROFILE.footer}</p>
              <p className={`${config.textMuted} text-xs mb-4`}>
                ©2026 Valve Corporation. Steam and the Steam logo are trademarks and/or registered trademarks of Valve
                Corporation in the U.S. and/or other countries.
              </p>
            </div>
          </footer>
      </div>
    </div>
  );
}
