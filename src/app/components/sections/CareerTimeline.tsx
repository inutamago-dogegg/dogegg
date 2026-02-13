import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import type { PaletteConfig } from '@/lib/theme';

interface CareerItem {
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
}

interface CareerTimelineProps {
  careers: CareerItem[];
  isDark: boolean;
  config: PaletteConfig;
  onCareerClick: (career: CareerItem) => void;
}

export function CareerTimeline({ careers, isDark, config, onCareerClick }: CareerTimelineProps) {
  // Timeline layout constants
  const TIMELINE_LEFT = 32;
  const DEFAULT_CARD_HEIGHT = 190;
  const CARD_GAP = 20;
  const BAR_WIDTH = 4;
  const CARD_LEFT_PADDING = 100;
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [cardHeights, setCardHeights] = useState<Record<string, number>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const getCareerId = (career: CareerItem) => `${career.company}-${career.period}`;
  const getCardHeight = (career: CareerItem) => cardHeights[getCareerId(career)] ?? DEFAULT_CARD_HEIGHT;

  // Step 1: Calculate event reppoints and count events per year
  const eventsWithReppoint = careers.map(career => {
    return {
      career,
      repDate: career.repDate,
      year: career.repDate.getFullYear()
    };
  });

  // Count events per year
  const eventCountByYear: Record<number, number> = {};
  const eventsByYear: Record<number, CareerItem[]> = {};
  eventsWithReppoint.forEach(({ year, career }) => {
    eventCountByYear[year] = (eventCountByYear[year] || 0) + 1;
    if (!eventsByYear[year]) {
      eventsByYear[year] = [];
    }
    eventsByYear[year]?.push(career);
  });

  // Get all years and sort (newest first)
  const years = Object.keys(eventCountByYear).map(Number).sort((a, b) => b - a);

  // Calculate year heights based on event count (more events = more height)
  const BASE_YEAR_HEIGHT = 200; // Base height per year
  
  const yearHeights: Record<number, number> = {};
  years.forEach(year => {
    const eventCount = eventCountByYear[year];
    const careersInYear = eventsByYear[year] ?? [];
    const cardsHeight = careersInYear.reduce((sum, career) => sum + getCardHeight(career), 0);
    const gapsHeight = Math.max(0, careersInYear.length - 1) * CARD_GAP;
    const fallbackHeight = (eventCount ?? 0) * (DEFAULT_CARD_HEIGHT + CARD_GAP * 2);
    yearHeights[year] = Math.max(BASE_YEAR_HEIGHT, cardsHeight + gapsHeight + CARD_GAP * 2, fallbackHeight);
  });

  // Calculate cumulative positions for years
  const yearPositions: Record<number, { topY: number; bottomY: number }> = {};
  let cumulativeY = 0;
  years.forEach(year => {
    const height = yearHeights[year];
    yearPositions[year] = {
      topY: cumulativeY,
      bottomY: cumulativeY + (height ?? 0)
    };
    cumulativeY += (height ?? 0);
  });

  const totalTimelineHeight = cumulativeY;

  // Helper function to get Y position for a date
  const getYPosition = (date: Date): number => {
    const year = date.getFullYear();
    const yearPos = yearPositions[year];
    if (!yearPos) return 0;

    // Calculate position within the year
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);
    const yearDuration = yearEnd.getTime() - yearStart.getTime();
    const dateOffset = date.getTime() - yearStart.getTime();
    const ratio = dateOffset / yearDuration;

    return yearPos.topY + ((1 - ratio) * (yearPos.bottomY - yearPos.topY));
  };

  // Step 2: Position cards based on reppoint, avoiding overlaps
  const cardPositions: Array<{
    career: CareerItem;
    topY: number;
    startY: number;
    endY: number;
    repY: number;
    height: number;
  }> = [];

  // Sort events by start date (top to bottom)
  const sortedEvents = [...eventsWithReppoint].sort(
    (a, b) => b.career.startDate.getTime() - a.career.startDate.getTime(),
  );

  const yearCursor: Record<number, number> = {};
  sortedEvents.forEach(({ career, repDate: repDate }) => {
    const repY = getYPosition(repDate);
    const representativeYear = career.repDate.getFullYear();
    const yearTop = yearPositions[representativeYear]?.topY ?? 0;
    const cardHeight = getCardHeight(career);
    const cursor = yearCursor[representativeYear] ?? CARD_GAP;
    const actualTop = yearTop + cursor;
    yearCursor[representativeYear] = cursor + cardHeight + CARD_GAP;

    cardPositions.push({
      career,
      topY: actualTop,
      startY: getYPosition(career.startDate),
      endY: getYPosition(career.endDate),
      repY: repY,
      height: cardHeight,
    });
  });

  const maxCardBottom = cardPositions.reduce((max, item) => Math.max(max, item.topY + item.height), 0);
  const timelineHeight = Math.max(totalTimelineHeight, maxCardBottom + CARD_GAP);
  const hoveredCareer = hoveredId
    ? cardPositions.find((item) => getCareerId(item.career) === hoveredId)
    : null;

  useLayoutEffect(() => {
    const nextHeights: Record<string, number> = {};
    let changed = false;

    Object.entries(cardRefs.current).forEach(([id, el]) => {
      if (!el) return;
      const height = el.getBoundingClientRect().height;
      if (!Number.isFinite(height) || height <= 0) return;
      nextHeights[id] = height;
      if (cardHeights[id] !== height) {
        changed = true;
      }
    });

    if (changed) {
      setCardHeights((prev) => ({ ...prev, ...nextHeights }));
    }
  }, [cardHeights, careers]);

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setHoveredId(null);
      return;
    }

    let rafId = 0;
    const updateHovered = () => {
      rafId = window.requestAnimationFrame(() => {
        const centerY = window.innerHeight / 2;
        let closestId: string | null = null;
        let closestDistance = Number.POSITIVE_INFINITY;

        Object.entries(cardRefs.current).forEach(([id, el]) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const mid = rect.top + rect.height / 2;
          const distance = Math.abs(mid - centerY);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestId = id;
          }
        });

        setHoveredId(closestId);
      });
    };

    updateHovered();
    window.addEventListener('scroll', updateHovered, { passive: true });
    window.addEventListener('resize', updateHovered);

    return () => {
      window.removeEventListener('scroll', updateHovered);
      window.removeEventListener('resize', updateHovered);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [isMobile, cardPositions.length]);

  const yearLinePositions: Record<number, number> = {};
  years.forEach(year => {
    yearLinePositions[year] = yearPositions[year]?.topY ?? 0;
  });

  yearLinePositions[(years[years.length - 1] ?? 0) - 1] = timelineHeight;

  const monthTicks = years.flatMap((year) =>
    Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const date = new Date(year, index, 1);
      return {
        key: `${year}-${month}`,
        y: getYPosition(date),
        month,
        year,
      };
    }),
  );

  return (
    <div className="relative max-w-3xl mx-auto" style={{ minHeight: `${timelineHeight}px` }}>
      {/* Timeline line */}
      <div 
        className={`absolute left-8 top-0 w-0.5 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}
        style={{ height: `${timelineHeight}px`, zIndex: 10 }}
      />

      {/* Month ticks */}
      {monthTicks.map((tick) => (
        <div
          key={tick.key}
            className={`absolute h-px ${isDark ? 'bg-gray-600' : 'bg-gray-400'}`}
          style={{
            left: `${TIMELINE_LEFT}px`,
            top: `${tick.y}px`,
              width: tick.month === 7 ? '24px' : '10px',
            transform: 'translateX(-50%)',
            zIndex: 11,
          }}
        />
      ))}

      {/* Year markers */}
      {Object.entries(yearLinePositions).map(([year, yearPos]) => {
        return (
          <motion.div
            key={year}
            initial={{ opacity: 0, x: 0 }}
            whileInView={{ opacity: 1, x: 12 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="absolute left-0"
            style={{ top: `${yearPos}px`, zIndex: 15 }}
          >
            <div className="flex items-center gap-2">
              <div className={`w-10 h-0.5 ${isDark ? 'bg-gray-600' : 'bg-gray-400'}`} />
            </div>
          </motion.div>
        );
      })}

      {
        years.map((year) => {
          const yearPos = yearPositions[year];
          return (
            <motion.div 
            key={year} 
            initial={{ opacity: 0, x: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="absolute"
            style={{
              top: `${((yearPos?.topY ?? 0) + (yearPos?.bottomY ?? 0)) / 2 - 10}px`,
              left: `${TIMELINE_LEFT - 48}px`,
              transform: 'translateX(-100%)',
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              zIndex: 15,
            }}
            >
              <div className="text-xl font-medium text-gray-500">
                {year}
              </div>
            </motion.div>
          )
        })
      }

      {/* Period bar (hover only) */}
      {hoveredCareer && (() => {
        const startY = getYPosition(hoveredCareer.career.startDate);
        const endY = getYPosition(hoveredCareer.career.endDate);
        const topPosition = Math.min(startY, endY);
        const barHeight = Math.abs(startY - endY);
        const barLeft = TIMELINE_LEFT + BAR_WIDTH / 2;

        return (
          <motion.div
            key={`hover-bar-${hoveredCareer.career.company}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute"
            style={{
              left: `${barLeft}px`,
              top: `${topPosition}px`,
              height: `${barHeight}px`,
              width: '2px',
              transform: 'translateX(-50%)',
              zIndex: 12,
            }}
          >
            <div className={`h-full ${config.buttonBg} opacity-80`} />
          </motion.div>
        );
      })()}

      {/* Month labels (hover only) */}
      {hoveredCareer && (() => {
        const startDate = hoveredCareer.career.startDate;
        const endDate = hoveredCareer.career.endDate;
        const getMonthCenterY = (date: Date) => getYPosition(new Date(date.getFullYear(), date.getMonth(), 15));
        const startLabel = `${startDate.getMonth() + 1}月`;
        const endLabel = `${endDate.getMonth() + 1}月`;
        const startY = getMonthCenterY(startDate);
        const endY = getMonthCenterY(endDate);
        const labels =
          startDate.getFullYear() === endDate.getFullYear() &&
          startDate.getMonth() === endDate.getMonth()
            ? [{ label: startLabel, y: startY }]
            : [
                { label: startLabel, y: startY },
                { label: endLabel, y: endY },
              ];

        return labels.map((item) => (
          <motion.div
            key={`month-${item.label}-${item.y}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`absolute text-xs ${config.textMuted}`}
            style={{
              left: `${TIMELINE_LEFT - 4}px`,
              top: `${item.y}px`,
              transform: 'translate(-100%, -50%)',
              zIndex: 20,
            }}
          >
            {item.label}
          </motion.div>
        ));
      })()}

      {/* Connector triangle from period to card (hover only) */}
      {hoveredCareer && (() => {
        const startX = TIMELINE_LEFT + BAR_WIDTH / 2;
        const endX = Math.max(startX + 8, CARD_LEFT_PADDING - 8);
        const cardCenterY = hoveredCareer.topY + hoveredCareer.height / 2;

        const lineLeft = Math.min(startX, endX);
        const lineTop = Math.min(hoveredCareer.startY, hoveredCareer.endY, cardCenterY);
        const lineWidth = Math.max(1, Math.abs(endX - startX));
        const lineHeight = Math.max(
          1,
          Math.max(hoveredCareer.startY, hoveredCareer.endY, cardCenterY) - lineTop,
        );

        const pointA = `${startX - lineLeft},${hoveredCareer.startY - lineTop}`;
        const pointB = `${startX - lineLeft},${hoveredCareer.endY - lineTop}`;
        const pointC = `${endX - lineLeft},${cardCenterY - lineTop}`;

        return (
          <motion.svg
            key={`connector-${hoveredCareer.career.company}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`absolute ${config.textMuted}`}
            style={{
              left: `${lineLeft}px`,
              top: `${lineTop}px`,
              width: `${lineWidth}px`,
              height: `${lineHeight}px`,
              zIndex: 25,
            }}
            viewBox={`0 0 ${lineWidth} ${lineHeight}`}
            preserveAspectRatio="none"
          >
            <polygon
              points={`${pointA} ${pointB} ${pointC}`}
              fill="currentColor"
              fillOpacity="1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </motion.svg>
        );
      })()}

      {/* Event cards */}
      <div className="absolute left-0 top-0 right-0" style={{ height: `${timelineHeight}px` }}>
        {cardPositions.map(({ career, topY }, index) => {
          const careerId = getCareerId(career);
          const hasDetail = Boolean(career.detailMarkdown || career.details.length > 0);
          const isActiveCard = isMobile && hoveredId === careerId;
          
          return (
            <motion.div
              key={`card-${career.company}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="absolute"
              onMouseEnter={() => setHoveredId(careerId)}
              onMouseLeave={() => setHoveredId((prev) => (prev === careerId ? null : prev))}
              style={{ 
                top: `${topY}px`, 
                left: 0, 
                right: 0,
                paddingLeft: `${CARD_LEFT_PADDING}px`
              }}
            >

              {/* Event card */}
              <div ref={(el) => { cardRefs.current[careerId] = el; }}>
                <Card 
                  className={`border-2 ${config.cardBorder} ${config.surfaceBg} backdrop-blur cursor-pointer max-w-xl relative ${
                    hasDetail ? 'group transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl' : 'transition-all duration-300'
                  } ${isActiveCard ? '-translate-y-1 shadow-xl' : ''}`}
                  style={{ zIndex: 45 }}
                  onClick={() => onCareerClick(career)}
                >
                {(
                  <span
                    className={`absolute right-3 top-3 inline-flex items-center justify-center rounded-full border ${config.surfaceBorder} ${config.surfaceBg} text-xs ${config.textMuted} h-7 w-7 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
                      isActiveCard ? 'opacity-100' : ''
                    }`}
                    aria-label="詳細あり"
                    title="詳細あり"
                  >
                    <Info className="h-4 w-4" />
                  </span>
                )}
                <CardHeader className="py-2 px-4 pb-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge className={`${config.badgeBg} border text-xs`}>
                          {career.category}
                        </Badge>
                        {career.isActive && (
                          <Badge className="bg-green-100 border-green-300 text-green-700 text-xs">
                            参加中
                          </Badge>
                        )}
                      </div>
                      <CardTitle className={`text-base ${config.textPrimary}`}>
                        {career.company}
                      </CardTitle>
                      <CardDescription className={`text-xs ${config.textMuted} mt-0.5`}>
                        {career.period}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <p className={`text-sm ${config.textSecondary} line-clamp-2 mb-2`}>
                    {career.details[0]}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {career.tech.map((tech, techIndex) => (
                      <Badge
                        key={techIndex}
                        variant="static"
                        className={`text-xs ${config.badgeBg} pointer-events-none`}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
