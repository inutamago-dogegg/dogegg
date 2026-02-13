import ReactMarkdown from 'react-markdown';
import type { PaletteConfig } from '@/lib/theme';

type MarkdownContentProps = {
  content: string;
  config: PaletteConfig;
};

export default function MarkdownContent({ content, config }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      components={{
        h1: (props) => <h1 className={`text-2xl font-semibold ${config.textPrimary}`} {...props} />,
        h2: (props) => <h2 className={`text-xl font-semibold ${config.textPrimary}`} {...props} />,
        h3: (props) => <h3 className={`text-lg font-semibold ${config.textPrimary}`} {...props} />,
        h4: (props) => <h4 className={`text-base font-semibold ${config.textPrimary}`} {...props} />,
        p: (props) => <p className={`${config.textSecondary} leading-relaxed`} {...props} />,
        ul: (props) => <ul className={`list-disc pl-5 space-y-1 ${config.textSecondary}`} {...props} />,
        ol: (props) => <ol className={`list-decimal pl-5 space-y-1 ${config.textSecondary}`} {...props} />,
        li: (props) => <li className="leading-relaxed" {...props} />,
        a: (props) => (
          <a className={`underline ${config.textSecondary}`} target="_blank" rel="noreferrer" {...props} />
        ),
        strong: (props) => <strong className={config.textPrimary} {...props} />,
        em: (props) => <em className={config.textSecondary} {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
