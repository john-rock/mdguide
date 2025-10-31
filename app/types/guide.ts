export interface GuideMetadata {
  title: string;
  description: string;
  author?: string;
  date?: string;
  tags?: string[];
  published?: boolean;
}

export interface Step {
  id: string;
  title: string;
  content: string;
  level: number;
}

export interface Guide {
  slug: string;
  metadata: GuideMetadata;
  steps: Step[];
  rawContent: string;
}

export interface GuideListItem {
  slug: string;
  metadata: GuideMetadata;
}

export interface SearchResult {
  slug: string;
  title: string;
  description: string;
  stepId?: string;
  stepTitle?: string;
  score: number;
}
