type AnalyticsEvent = "match_view" | "analysis_started" | "analysis_completed";

declare global {
  interface Window {
    umami?: {
      track: (event: string) => Promise<void>;
    };
  }
}

const analyticsEnabled = Boolean(process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID);
const pendingEvents: AnalyticsEvent[] = [];
let isReady = false;

function send(event: AnalyticsEvent) {
  if (!window.umami) return;
  try {
    void window.umami.track(event).catch(() => {});
  } catch {
    // Analytics must never interrupt the application.
  }
}

export function trackAnalyticsEvent(event: AnalyticsEvent) {
  if (!analyticsEnabled || typeof window === "undefined") return;
  if (isReady && window.umami) send(event);
  else pendingEvents.push(event);
}

export function initializeAnalytics() {
  if (!window.umami) return;
  isReady = true;
  pendingEvents.splice(0).forEach(send);
}