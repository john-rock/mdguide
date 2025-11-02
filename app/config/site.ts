import { SiteConfig } from '@/app/types/site';

export const siteConfig: SiteConfig = {
  metadata: {
    title: 'mdguide',
    description: 'A modern documentation and guide platform with step-by-step guides, full-text search, and progress tracking.',
  },
  homepage: {
    title: 'Guides',
    description: 'Step-by-step guides to help you get started and learn advanced features.',
  },
  footer: {
    text: 'Built with mdguide',
  },
  llmsTxt: {
    enabled: true,
    includeStepContent: false,
  },
  openGraph: {
    // Leave undefined to use auto-generated OG image
    // Or set to a custom image path like '/og-image.png'
    homepageImage: undefined,
  },
};
