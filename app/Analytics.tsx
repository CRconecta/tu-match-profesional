"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { analyticsOptedOut, initializeAnalytics, trackAnalyticsEvent } from "../lib/analytics";

export default function Analytics({ websiteId }: { websiteId: string }) {
  // El script de Umami solo se carga si el navegador NO envía DNT ni GPC.
  const [enabled, setEnabled] = useState(false);
  useEffect(() => { setEnabled(!analyticsOptedOut()); }, []);

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

  // Clics en WhatsApp de todo el sitio (incluida la página de inicio) sin modificar cada página.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (target instanceof Element && target.closest('a[href^="https://wa.me/"]')) trackAnalyticsEvent("whatsapp_click");
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!enabled) return null;
  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id={websiteId}
      data-exclude-search="true"
      data-exclude-hash="true"
      data-do-not-track="true"
      strategy="afterInteractive"
      onReady={initializeAnalytics}
    />
  );
}
