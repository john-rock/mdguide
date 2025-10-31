"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Step } from "@/app/types/guide";

interface StepSectionProps {
  step: Step;
}

export function StepSection({ step }: StepSectionProps) {
  return (
    <section id={step.id} className="scroll-mt-20 mb-16">
      <h2 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        {step.title}
      </h2>
      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            h1: ({ ...props }) => (
              <h1
                className="mb-4 text-4xl font-bold text-zinc-900 dark:text-zinc-50"
                {...props}
              />
            ),
            h2: ({ ...props }) => (
              <h2
                className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50"
                {...props}
              />
            ),
            h3: ({ ...props }) => (
              <h3
                className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50"
                {...props}
              />
            ),
            p: ({ ...props }) => (
              <p
                className="mb-4 leading-7 text-zinc-700 dark:text-zinc-300"
                {...props}
              />
            ),
            ul: ({ ...props }) => (
              <ul
                className="mb-4 ml-6 list-disc space-y-2 text-zinc-700 dark:text-zinc-300"
                {...props}
              />
            ),
            ol: ({ ...props }) => (
              <ol
                className="mb-4 ml-6 list-decimal space-y-2 text-zinc-700 dark:text-zinc-300"
                {...props}
              />
            ),
            li: ({ ...props }) => <li className="leading-7" {...props} />,
            a: ({ ...props }) => (
              <a
                className="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
                {...props}
              />
            ),
            code: ({ className, ...props }) => {
              // Inline code
              if (!className) {
                return (
                  <code
                    className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm font-mono text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                    {...props}
                  />
                );
              }
              // Code block (handled by pre)
              return <code className={className} {...props} />;
            },
            pre: ({ ...props }) => (
              <pre
                className="mb-4 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm dark:bg-zinc-950"
                {...props}
              />
            ),
            blockquote: ({ ...props }) => (
              <blockquote
                className="mb-4 border-l-4 border-zinc-300 pl-4 italic text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                {...props}
              />
            ),
          }}
        >
          {step.content}
        </ReactMarkdown>
      </div>
    </section>
  );
}
