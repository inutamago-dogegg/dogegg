import type { PaletteConfig } from '@/lib/theme';

type NavSection = {
  id: string;
  label: string;
};

type SectionNavProps = {
  navSections: ReadonlyArray<NavSection>;
  activeSection: string;
  isDark: boolean;
  config: PaletteConfig;
};

export default function SectionNav({ navSections, activeSection, isDark, config }: SectionNavProps) {
  if (navSections.length === 0) {
    return null;
  }

  return (
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
              className={`rounded-full border ${config.surfaceBorder} ${config.surfaceBg} px-3 py-1 text-xs font-medium ${config.textSecondary} shadow-md backdrop-blur-md transition-all duration-200 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0`}
            >
              {section.label}
            </span>
            <span
              className={`h-3 w-3 rounded-full transition-transform duration-200 ${
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
  );
}
