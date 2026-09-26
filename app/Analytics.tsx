"use client";

import Script from "next/script";
import { useEffect } from "react";
import { initializeAnalytics, trackAnalyticsEvent } from "../lib/analytics";

export default function Analytics({ websiteId }: { websiteId: string }) {
  useEffect(() => {
    const matchSection = document.querySelector(".workspace");
    if (!matchSection || !("IntersectionObserver" in window)) return;

    let hasTrackedMatchView = false;
    const observer = new IntersectionObserver((entries) => {
      if (hasTrackedMatchView || !entries.some((entry) => entry.isIntersecting)) return;
      hasTrackedMatchView = true;
      trackAnalyticsEvent("match_view");
      observer.disconnect();
    }, { threshold: 0.01 });

    observer.observe(matchSection);
    return () => observer.disconnect();
  }, []);

  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id={websiteId}
      data-exclude-search="true"
      data-exclude-hash="true"
      strategy="afterInteractive"
      onReady={initializeAnalytics}
    />
  );
}