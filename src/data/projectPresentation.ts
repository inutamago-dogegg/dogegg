import type { ProjectItem } from '@/data/content';
import MissileShiftDetail from '@/data/projects/missile-shift.md?raw';
import FlashelixDetail from '@/data/projects/flashelix.md?raw';

type ProjectPresentationOverride = Partial<
  Pick<ProjectItem, 'title' | 'period' | 'outline' | 'detailMarkdown'>
>;

const PROJECT_PRESENTATION_OVERRIDES: Record<string, ProjectPresentationOverride> = {
  MissileShift: {
    period: '2026年6月 (準備1週間, 制作2日)',
    outline: '部内春ハッカソンでグラフィックを担当しました。',
    detailMarkdown: MissileShiftDetail,
  },
  Flashelix: {
    period: '2026年7月 (制作4日)',
    outline: 'GMTK Game Jam 2026で制作した謎解きパズルアクションゲームです。',
    detailMarkdown: FlashelixDetail,
  },
  'Deeper and Deeper (ハッカソン版)': {
    period: '2025年12月~2026年1月 (準備1週間, 制作1週間)',
  },
  'Cross the C': {
    title: 'Cross the Sea',
    period: '2024年7月~現在 (約2年1か月)',
  },
  バリバリベンジ: {
    period: '2023年7月~開発凍結',
  },
};

/**
 * content.ts に残っている過去の公開情報を、現在の表示内容へ正規化する。
 * 元タイトルは外部URLや既存データとの互換性のため保持する。
 */
export function normalizeProjectPresentation(project: ProjectItem): ProjectItem {
  return {
    ...project,
    ...(PROJECT_PRESENTATION_OVERRIDES[project.title] ?? {}),
  };
}
