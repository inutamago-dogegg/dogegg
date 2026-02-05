import type { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { LABELS } from "@/data/content";
import { Github, Sun, Moon } from "lucide-react";
import { themeConfig, type ThemeKey } from "@/lib/theme";
import { PROFILE } from "@/data/content";

export type FooterConfig = {
    surfaceBg: string;
    surfaceBorder: string;
    textMuted: string;
    buttonBg: string;
    buttonOutline: string;
}

export type FooterProps = {
    config: FooterConfig;
    theme: ThemeKey;
    isDark: boolean;
    setTheme: Dispatch<SetStateAction<ThemeKey>>;
    setIsDark: Dispatch<SetStateAction<boolean>>;
}

export default function SiteFooter({
    config,
    theme,
    isDark,
    setTheme,
    setIsDark,
}: FooterProps) {
    return (
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
    )
}