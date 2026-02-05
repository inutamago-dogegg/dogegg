import { Home, FolderOpen, User } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

type HeaderConfig = {
  navBg: string;
  navBorder: string;
  textPrimary: string;
  textSecondary: string;
  buttonBg: string;
};

type HeaderProps = {
  config: HeaderConfig;
  isDark: boolean;
  homeUrl: string;
  aboutUrl: string;
  worksUrl: string;
  titleText: string;
  titleHref: string;
  titleTitle: string;
  activePage?: 'home' | 'about' | 'works';
};

export default function SiteHeader({
  config,
  isDark,
  homeUrl,
  aboutUrl,
  worksUrl,
  titleText,
  titleHref,
  titleTitle,
  activePage,
}: HeaderProps) {
  const navGhostClass = `${config.textSecondary} ${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`;
  const isHomePage = activePage === 'home';
  const isAboutPage = activePage === 'about';
  const isWorksPage = activePage === 'works';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${config.navBg} backdrop-blur-md border-b ${config.navBorder} shadow-sm`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a
            href={titleHref}
            className={`text-2xl font-bold ${config.textPrimary} whitespace-nowrap`}
            title={titleTitle}
          >
            {titleText}
          </a>
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
                <a href={worksUrl}>
                  <FolderOpen className="w-4 h-4 mr-0" />
                  Works
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
