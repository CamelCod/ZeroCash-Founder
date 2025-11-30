import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-slate prose-indigo max-w-none">
      <ReactMarkdown
        components={{
          h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-slate-900 mb-4 mt-6 border-b pb-2" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl font-bold text-slate-800 mb-3 mt-6" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-indigo-700 mb-2 mt-4" {...props} />,
          p: ({node, ...props}) => <p className="text-slate-600 leading-relaxed mb-4" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 text-slate-600" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-4 text-slate-600" {...props} />,
          li: ({node, ...props}) => <li className="ml-2" {...props} />,
          strong: ({node, ...props}) => <strong className="font-semibold text-slate-900" {...props} />,
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 my-4 bg-indigo-50 rounded-r text-indigo-900 italic" {...props} />
          ),
          code: ({node, className, children, ...props}) => { // Fixed destructuring here
            return (
              <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};