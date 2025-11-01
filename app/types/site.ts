export interface GuideIndexConfig {
  title: string;
  description: string;
}

export interface SiteConfig {
  name: string;
  description: string;
  guideIndex: GuideIndexConfig;
}
