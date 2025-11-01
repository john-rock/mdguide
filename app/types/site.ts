export interface SiteMetadata {
  title: string;
  description: string;
}

export interface HomepageConfig {
  title: string;
  description: string;
}

export interface SiteConfig {
  metadata: SiteMetadata;
  homepage: HomepageConfig;
}
