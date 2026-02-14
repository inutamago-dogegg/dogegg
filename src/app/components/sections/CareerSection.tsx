import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, ExternalLink, X } from 'lucide-react';
import { CAREERS, PROFILE } from '@/data/content';
import MarkdownContent from '@/app/components/MarkdownContent';
import { CareerTimeline } from '@/app/components/sections/CareerTimeline';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import type { PaletteConfig } from '@/lib/theme';

type CareerSectionProps = {
  config: PaletteConfig;
  isDark: boolean;
};

type TimelineCareerItem = {
  period: string;
  company: string;
  startDate: Date;
  endDate: Date;
  repDate: Date;
  isActive: boolean;
  detailMarkdown?: string;
  details: string[];
  category: string;
  url?: string;
  tech: string[];
};

const parseDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
};

export default function CareerSection({ config, isDark }: CareerSectionProps) {
  const [selectedCareer, setSelectedCareer] = useState<TimelineCareerItem | null>(null);
  const makeHash = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return slug.length > 0 ? slug : encodeURIComponent(value);
  };
  const openCareerDetail = (career: TimelineCareerItem) => {
    setSelectedCareer(career);
    const hash = `#career-${makeHash(career.company)}`;
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`);
  };
  const closeCareerDetail = () => {
    setSelectedCareer(null);
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  };
  const baseUrl = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const timelineCareers: TimelineCareerItem[] = CAREERS.map((career) => {
    const startDate = parseDate(career.startDate);
    const endDate = career.endDate ? parseDate(career.endDate) : new Date(Date.now());
    const repDate = parseDate(career.representativeDate);
    const period = career.period;
    const isActive = career.endDate === null || endDate.getTime() >= Date.now();
    const base = {
      period,
      company: career.company,
      startDate,
      endDate,
      repDate,
      isActive,
      details: career.details,
      category: career.category,
      tech: career.tech ?? [],
    };
    const withDetail = career.detailMarkdown ? { ...base, detailMarkdown: career.detailMarkdown } : base;
    return career.url ? { ...withDetail, url: career.url } : withDetail;
  });

  useEffect(() => {
    const openFromHash = () => {
      const hash = window.location.hash;
      if (!hash || !hash.startsWith('#career-')) {
        setSelectedCareer(null);
        return;
      }
      const slug = hash.replace('#career-', '');
      const target = timelineCareers.find((career) => makeHash(career.company) === slug);
      if (target) {
        setSelectedCareer(target);
      } else {
        window.location.assign(`${baseUrl}404/`);
      }
    };

    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, [baseUrl, timelineCareers]);

  useEffect(() => {
    if (!selectedCareer) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedCareer]);

  return (
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

        <CareerTimeline
          careers={timelineCareers}
          isDark={isDark}
          config={config}
          onCareerClick={(career) => {
            openCareerDetail(career);
          }}
        />

        {/* Career Detail Dialog */}
        <Dialog
          open={selectedCareer !== null}
          onOpenChange={(open) => !open && closeCareerDetail()}
        >
          <DialogContent
            className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white'} max-w-2xl overflow-hidden`}
          >
            <div className="max-h-[85vh] overflow-y-auto">
              <div
                className={`sticky top-0 z-10 border-b ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white'}`}
              >
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-3 top-3"
                  onClick={() => closeCareerDetail()}
                  aria-label="閉じる"
                >
                  <X className="h-4 w-4" />
                </Button>
                {selectedCareer && (
                  <div className="px-6 pt-6 pb-4">
                    <DialogHeader>
                      <div className="flex items-center gap-3">
                        {selectedCareer.url ? (
                          <button
                            type="button"
                            onClick={() => window.open(selectedCareer.url, '_blank')}
                            className={`p-3 ${config.buttonBg} rounded-lg`}
                            aria-label="関連リンクを開く"
                          >
                            <Briefcase className="w-6 h-6 text-white" />
                          </button>
                        ) : (
                          <div className={`p-3 ${config.buttonBg} rounded-lg`}>
                            <Briefcase className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div>
                          <DialogTitle className={`text-2xl ${config.textPrimary}`}>
                            {selectedCareer.company}
                          </DialogTitle>
                          <DialogDescription className={`text-base ${config.textMuted} mt-1`}>
                            {selectedCareer.period}
                          </DialogDescription>
                        </div>
                      </div>
                    </DialogHeader>
                  </div>
                )}
              </div>

              {selectedCareer && (
                <div className="px-6 pb-6 pt-3 space-y-4">
                <div>
                  <h4 className={`text-sm font-semibold ${config.textMuted} mb-2`}>カテゴリ</h4>
                  <Badge className={`${config.badgeBg} border`}>{selectedCareer.category}</Badge>
                </div>

                <div>
                  <h4 className={`text-sm font-semibold ${config.textMuted} mb-2`}>詳細</h4>
                  <MarkdownContent
                    content={selectedCareer.detailMarkdown ?? selectedCareer.details.join('\n\n')}
                    config={config}
                  />
                </div>

                <div>
                  <h4 className={`text-sm font-semibold ${config.textMuted} mb-2`}>使用技術</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCareer.tech.map((tech, index) => (
                      <Badge key={index} variant="static" className={`${config.badgeBg} border pointer-events-none`}>
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedCareer.url && (
                  <div className="pt-4">
                    <Button
                      className={`${config.buttonBg} text-white w-full`}
                      onClick={() => window.open(selectedCareer.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      詳細を見る
                    </Button>
                  </div>
                )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
