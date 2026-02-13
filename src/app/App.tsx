import { useEffect, useMemo, useState } from 'react';
import FloatingOrbs from '@/app/components/FloatingOrbs';
import SectionNav from '@/app/components/SectionNav';
import SiteFooter from '@/app/components/SiteFooter';
import SiteHeader from '@/app/components/SiteHeader';
import AboutIntroSection from '@/app/components/sections/AboutIntroSection';
import ArticlesSection from '@/app/components/sections/ArticlesSection';
import CareerSection from '@/app/components/sections/CareerSection';
import FeaturedSection from '@/app/components/sections/FeaturedSection';
import HobbySection from '@/app/components/sections/HobbySection';
import HomeSection from '@/app/components/sections/HomeSection';
import NotFoundSection from '@/app/components/sections/NotFoundSection';
import RecentArticlesSection from '@/app/components/sections/RecentArticlesSection';
import SkillsSection from '@/app/components/sections/SkillsSection';
import WorksSection from '@/app/components/sections/WorksSection';
import { ABOUT_NAV_SECTIONS, PROJECTS, PROFILE, type ProjectItem } from '@/data/content';
import type { OgpMap } from '@/app/types';
import { themeConfig, type ThemeKey, getInitialThemeKey } from '@/lib/theme';

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

          {isHomePage && (
            <HomeSection
              config={config}
              theme={theme}
              aboutUrl={aboutUrl}
              worksPageUrl={worksPageUrl}
              articlesPageUrl={articlesPageUrl}
            />
          )}

          {isAboutPage && <AboutIntroSection config={config} theme={theme} />}

          {isAboutPage && <SkillsSection config={config} />}

          {isAboutPage && <CareerSection config={config} isDark={isDark} />}

          {isAboutPage && (
            <FeaturedSection
              config={config}
              isDark={isDark}
              ogpData={ogpData}
              worksPageUrl={worksPageUrl}
              featuredProjects={featuredProjects}
            />
          )}

          {isAboutPage && (
            <RecentArticlesSection
              config={config}
              ogpData={ogpData}
              articlesPageUrl={articlesPageUrl}
            />
          )}

          {isWorksPage && (
            <WorksSection
              config={config}
              isDark={isDark}
              ogpData={ogpData}
              projects={projects}
              openYears={openYears}
              setOpenYears={setOpenYears}
            />
          )}

          {isArticlesPage && <ArticlesSection config={config} ogpData={articlesOgpData} />}

          {isAboutPage && <HobbySection config={config} ogpData={ogpData} isDark={isDark} />}

          {isNotFoundPage && (
            <NotFoundSection diceBase={diceBase} showDebugPinzoro={showDebugPinzoro} />
          )}

          <SiteFooter config={config} isDark={isDark} theme={theme} setTheme={setTheme} setIsDark={setIsDark} />
      </div>
    </div>
  );
}
