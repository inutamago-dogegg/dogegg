import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import FloatingOrbs from '@/app/components/FloatingOrbs';
import SectionNav from '@/app/components/SectionNav';
import SiteFooter from '@/app/components/SiteFooter';
import SiteHeader from '@/app/components/SiteHeader';
import { ABOUT_NAV_SECTIONS, PROJECTS, PROFILE, type ProjectItem } from '@/data/content';
import type { OgpMap } from '@/app/types';
import { themeConfig, type ThemeKey, getInitialThemeKey } from '@/lib/theme';

const AboutIntroSection = lazy(() => import('@/app/components/sections/AboutIntroSection'));
const ArticlesSection = lazy(() => import('@/app/components/sections/ArticlesSection'));
const CareerSection = lazy(() => import('@/app/components/sections/CareerSection'));
const FeaturedSection = lazy(() => import('@/app/components/sections/FeaturedSection'));
const HobbySection = lazy(() => import('@/app/components/sections/HobbySection'));
const HomeSection = lazy(() => import('@/app/components/sections/HomeSection'));
const NotFoundSection = lazy(() => import('@/app/components/sections/NotFoundSection'));
const RecentArticlesSection = lazy(() => import('@/app/components/sections/RecentArticlesSection'));
const SkillsSection = lazy(() => import('@/app/components/sections/SkillsSection'));
const WorksSection = lazy(() => import('@/app/components/sections/WorksSection'));

export type AppProps = {
  ogpData: OgpMap;
  articlesOgpData?: OgpMap;
  mode?: 'home' | 'about' | 'works' | 'articles' | 'notFound';
}

export default function App({ ogpData, articlesOgpData = {}, mode = 'home' }: AppProps) {
  const isHomePage = mode === 'home';
  const isAboutPage = mode === 'about';
  const isWorksPage = mode === 'works';
  const isArticlesPage = mode === 'articles';
  const isNotFoundPage = mode === 'notFound';
  const [theme, setTheme] = useState<ThemeKey>(getInitialThemeKey());
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
    () =>
      (isAboutPage ? ABOUT_NAV_SECTIONS : isWorksPage ? worksNavSections : []).map((section) => ({
        ...section,
      })),
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
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});

  const sectionFallback = (
    <div className={`py-16 text-center ${config.textMuted}`}>
      <p>Loading...</p>
    </div>
  );

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

    if (navSections.length === 0) {
      setActiveSection(isWorksPage ? worksNavSections[0]?.id ?? 'works' : 'home');
      return;
    }

    const updateActiveByCenter = () => {
      const sections = navSections.map((section) => document.getElementById(section.id)).filter(
        (section): section is HTMLElement => Boolean(section),
      );
      if (sections.length === 0) {
        setActiveSection(isWorksPage ? worksNavSections[0]?.id ?? 'works' : 'home');
        return;
      }
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
  }, [isWorksPage, navSections, worksNavSections, visibleSections]);

  useEffect(() => {
    const sequence = isAboutPage
      ? ['aboutIntro', 'skills', 'career', 'featured', 'recentArticles', 'hobby', 'footer']
      : isWorksPage
          ? ['works', 'footer']
          : isArticlesPage
              ? ['articles', 'footer']
              : isHomePage
                  ? ['home', 'footer']
                  : isNotFoundPage
                      ? ['notFound', 'footer']
                      : ['footer'];
    let cancelled = false;
    let index = 0;
    const timers: number[] = [];

    const firstKey = sequence[0];
    setVisibleSections(firstKey ? { [firstKey]: true } : {});

    const scheduleNext = () => {
      if (cancelled || index >= sequence.length) return;
      const timeoutId = window.setTimeout(showNext, 120);
      timers.push(timeoutId);
    };

    const showNext = () => {
      if (cancelled || index >= sequence.length) return;
      const key = sequence[index];
      if (!key) return;
      index += 1;
      setVisibleSections((prev) => ({ ...prev, [key]: true }));
      scheduleNext();
    };

    index = 1;
    scheduleNext();

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [isAboutPage, isArticlesPage, isHomePage, isNotFoundPage, isWorksPage]);

  const projects = PROJECTS;
  const allProjects = PROJECTS.flatMap((group) => group.items);
  const featuredOrder = ['Cross the C', 'ELEGO', 'Orbit', 'バリバリベンジ'];
  const featuredProjects = featuredOrder
    .map((title) => allProjects.find((project) => project.title === title))
    .filter((project): project is ProjectItem => Boolean(project));
  const baseUrl = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const homeUrl = baseUrl;
  const aboutUrl = `${baseUrl}about/`;
  const worksPageUrl = `${baseUrl}works/`;
  const articlesPageUrl = `${baseUrl}articles/`;
  const diceBase = `${baseUrl}dice/`;
  const showDebugPinzoro = false;

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
          <FloatingOrbs config={config} />

          <SiteHeader
            config={config}
            isDark={isDark}
            homeUrl={homeUrl}
            aboutUrl={aboutUrl}
            worksUrl={worksPageUrl}
            articlesUrl={articlesPageUrl}
            titleText={PROFILE.title}
            titleHref={homeUrl}
            titleTitle={homeUrl}
            activePage={isHomePage ? 'home' : isAboutPage ? 'about' : isArticlesPage ? 'articles' : 'works'}
          />

          <SectionNav
            navSections={navSections}
            activeSection={activeSection}
            isDark={isDark}
            config={config}
          />

          {isHomePage && visibleSections.home && (
            <Suspense fallback={sectionFallback}>
              <HomeSection
                config={config}
                theme={theme}
                aboutUrl={aboutUrl}
                worksPageUrl={worksPageUrl}
                articlesPageUrl={articlesPageUrl}
              />
            </Suspense>
          )}

          {isAboutPage && visibleSections.aboutIntro && (
            <Suspense fallback={sectionFallback}>
              <AboutIntroSection config={config} theme={theme} />
            </Suspense>
          )}

          {isAboutPage && visibleSections.skills && (
            <Suspense fallback={sectionFallback}>
              <SkillsSection config={config} />
            </Suspense>
          )}

          {isAboutPage && visibleSections.career && (
            <Suspense fallback={sectionFallback}>
              <CareerSection config={config} isDark={isDark} />
            </Suspense>
          )}

          {isAboutPage && visibleSections.featured && (
            <Suspense fallback={sectionFallback}>
              <FeaturedSection
                config={config}
                isDark={isDark}
                ogpData={ogpData}
                worksPageUrl={worksPageUrl}
                featuredProjects={featuredProjects}
              />
            </Suspense>
          )}

          {isAboutPage && visibleSections.recentArticles && (
            <Suspense fallback={sectionFallback}>
              <RecentArticlesSection
                config={config}
                ogpData={ogpData}
                articlesPageUrl={articlesPageUrl}
              />
            </Suspense>
          )}

          {isWorksPage && visibleSections.works && (
            <Suspense fallback={sectionFallback}>
              <WorksSection
                config={config}
                isDark={isDark}
                ogpData={ogpData}
                projects={projects}
                openYears={openYears}
                setOpenYears={setOpenYears}
              />
            </Suspense>
          )}

          {isArticlesPage && visibleSections.articles && (
            <Suspense fallback={sectionFallback}>
              <ArticlesSection config={config} ogpData={articlesOgpData} />
            </Suspense>
          )}

          {isAboutPage && visibleSections.hobby && (
            <Suspense fallback={sectionFallback}>
              <HobbySection config={config} ogpData={ogpData} isDark={isDark} />
            </Suspense>
          )}

          {isNotFoundPage && visibleSections.notFound && (
            <Suspense fallback={sectionFallback}>
              <NotFoundSection diceBase={diceBase} showDebugPinzoro={showDebugPinzoro} />
            </Suspense>
          )}

          {visibleSections.footer && (
            <Suspense fallback={null}>
              <SiteFooter
                config={config}
                isDark={isDark}
                theme={theme}
                setTheme={setTheme}
                setIsDark={setIsDark}
              />
            </Suspense>
          )}
      </div>
    </div>
  );
}
