"use client";

import { useEffect } from "react";

interface DynamicOgMetaProps {
  guideSlug: string;
}

/**
 * Client-side component to update OG meta tags when the URL hash changes
 * This ensures that when users share step-specific URLs, the correct OG image is used
 */
export function DynamicOgMeta({ guideSlug }: DynamicOgMetaProps) {
  useEffect(() => {
    const updateOgImage = () => {
      const hash = window.location.hash.slice(1);
      let ogImageUrl = `${window.location.origin}/api/og?slug=${guideSlug}`;

      // If there's a step hash, add it to the OG image URL
      if (hash && hash.startsWith("step-")) {
        const stepNumber = hash.replace("step-", "");
        ogImageUrl += `&step=${stepNumber}`;
      }

      // Update or create OG image meta tags
      let ogImageTag = document.querySelector('meta[property="og:image"]') as HTMLMetaElement;
      if (!ogImageTag) {
        ogImageTag = document.createElement("meta");
        ogImageTag.setAttribute("property", "og:image");
        document.head.appendChild(ogImageTag);
      }
      ogImageTag.setAttribute("content", ogImageUrl);

      let twitterImageTag = document.querySelector('meta[name="twitter:image"]') as HTMLMetaElement;
      if (!twitterImageTag) {
        twitterImageTag = document.createElement("meta");
        twitterImageTag.setAttribute("name", "twitter:image");
        document.head.appendChild(twitterImageTag);
      }
      twitterImageTag.setAttribute("content", ogImageUrl);
    };

    // Update on mount
    updateOgImage();

    // Update when hash changes
    window.addEventListener("hashchange", updateOgImage);

    return () => {
      window.removeEventListener("hashchange", updateOgImage);
    };
  }, [guideSlug]);

  return null;
}
