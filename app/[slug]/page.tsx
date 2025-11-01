import { notFound } from "next/navigation";
import { getGuideBySlug, getAllGuideSlugs } from "@/app/lib/guides/loader";
import { GuideContent } from "@/app/components/guides/GuideContent";
import type { Metadata } from "next";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all guides at build time
export async function generateStaticParams() {
  const slugs = getAllGuideSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: "Guide Not Found",
    };
  }

  return {
    title: guide.metadata.title,
    description: guide.metadata.description,
    authors: guide.metadata.author ? [{ name: guide.metadata.author }] : [],
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return <GuideContent guide={guide} />;
}
