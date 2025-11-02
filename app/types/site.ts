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

export interface SiteConfig {
  metadata: SiteMetadata;
  homepage: HomepageConfig;
  footer: FooterConfig;
  llmsTxt?: LlmsTxtConfig;
}
