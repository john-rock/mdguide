import { Guide } from "@/app/types/guide";
import { siteConfig } from "@/app/config/site";

/**
 * Generates an llms.txt file content from all published guides
 * Following the llms.txt specification for LLM-friendly documentation
 * @see https://llmstxt.org/
 */
export function generateLlmsTxt(guides: Guide[]): string {
  const { metadata } = siteConfig;
  const includeStepContent = siteConfig.llmsTxt?.includeStepContent ?? true;

  const lines: string[] = [];

  // Header section
  lines.push(`# ${metadata.title}`);
  lines.push('');
  lines.push(metadata.description);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Table of contents
  lines.push('## Guides');
  lines.push('');

  for (const guide of guides) {
    lines.push(`- [${guide.metadata.title}](#${guide.slug})`);
  }

  lines.push('');
  lines.push('---');
  lines.push('');

  // Guide content
  for (const guide of guides) {
    lines.push(`## ${guide.metadata.title} {#${guide.slug}}`);
    lines.push('');

    // Guide metadata
    if (guide.metadata.description) {
      lines.push(guide.metadata.description);
      lines.push('');
    }

    if (guide.metadata.author || guide.metadata.date) {
      const meta: string[] = [];
      if (guide.metadata.author) meta.push(`Author: ${guide.metadata.author}`);
      if (guide.metadata.date) meta.push(`Date: ${guide.metadata.date}`);
      lines.push(meta.join(' | '));
      lines.push('');
    }

    if (guide.metadata.tags && guide.metadata.tags.length > 0) {
      lines.push(`Tags: ${guide.metadata.tags.join(', ')}`);
      lines.push('');
    }

    lines.push(`URL: /${guide.slug}`);
    lines.push('');

    // Steps
    if (guide.steps.length > 0) {
      lines.push('### Steps');
      lines.push('');

      for (let i = 0; i < guide.steps.length; i++) {
        const step = guide.steps[i];
        lines.push(`${i + 1}. ${step.title}`);

        // Optionally include step content
        if (includeStepContent && step.content) {
          lines.push('');
          // Clean up markdown content for better readability
          const cleanContent = step.content
            .trim()
            .replace(/\n{3,}/g, '\n\n'); // Remove excessive newlines
          lines.push(cleanContent);
          lines.push('');
        }
      }

      lines.push('');
    }

    lines.push('---');
    lines.push('');
  }

  // Footer
  lines.push(`Generated from ${metadata.title}`);
  lines.push(`Total Guides: ${guides.length}`);
  lines.push(`Last Updated: ${new Date().toISOString().split('T')[0]}`);

  return lines.join('\n');
}
