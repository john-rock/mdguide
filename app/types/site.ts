export interface SiteMetadata {
  title: string;
  description: string;
}

export interface HomepageConfig {
  title: string;
  description: string;
}

export interface FooterConfig {
  text: string;
}

export interface LlmsTxtConfig {
  enabled: boolean;
  includeStepContent?: boolean;
}

export interface OpenGraphConfig {
  /**
   * Custom image path for homepage OG image (e.g., '/og-image.png')
   * If not set, a dynamic OG image will be generated
   * Place custom images in the /public directory
   */
  homepageImage?: string;
}

export interface SiteConfig {
  metadata: SiteMetadata;
  homepage: HomepageConfig;
  footer: FooterConfig;
  llmsTxt?: LlmsTxtConfig;
  openGraph?: OpenGraphConfig;
}
