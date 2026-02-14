import ReactMarkdown from 'react-markdown';
import type { PaletteConfig } from '@/lib/theme';

type MarkdownContentProps = {
  content: string;
  config: PaletteConfig;
};

export default function MarkdownContent({ content, config }: MarkdownContentProps) {
  return (
    <div className="space-y-3">
      <ReactMarkdown
        components={{
          h1: (props) => (
            <h1 className={`text-2xl font-semibold ${config.textPrimary} mt-5 first:mt-0 mb-2`} {...props} />
          ),
          h2: (props) => (
            <h2 className={`text-xl font-semibold ${config.textPrimary} mt-4 first:mt-0 mb-2`} {...props} />
          ),
          h3: (props) => (
            <h3 className={`text-lg font-semibold ${config.textPrimary} mt-4 first:mt-0 mb-2`} {...props} />
          ),
          h4: (props) => (
            <h4 className={`text-base font-semibold ${config.textPrimary} mt-3 first:mt-0 mb-1`} {...props} />
          ),
          p: (props) => <p className={`text-sm ${config.textSecondary} leading-relaxed`} {...props} />,
          ul: (props) => <ul className={`list-disc pl-5 space-y-1 text-sm ${config.textSecondary}`} {...props} />,
          ol: (props) => <ol className={`list-decimal pl-5 space-y-1 text-sm ${config.textSecondary}`} {...props} />,
          li: (props) => <li className="leading-relaxed" {...props} />,
          a: (props) => (
            <a
              className={`underline underline-offset-4 ${config.textSecondary} transition-colors hover:${config.textPrimary}`}
              target="_blank"
              rel="noreferrer"
              {...props}
            />
          ),
          strong: (props) => <strong className={config.textPrimary} {...props} />,
          em: (props) => <em className={config.textSecondary} {...props} />,
          code: (props) => (
            <code
              className={`rounded px-1 py-0.5 text-xs ${config.surfaceBg} ${config.textSecondary} border ${config.surfaceBorder}`}
              {...props}
            />
          ),
          blockquote: (props) => (
            <blockquote
              className={`border-l-2 pl-3 text-sm ${config.textSecondary} ${config.surfaceBorder}`}
              {...props}
            />
          ),
          hr: (props) => <hr className={`my-3 ${config.surfaceBorder}`} {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
