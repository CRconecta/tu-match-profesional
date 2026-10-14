// Analítica agregada: solo se envían NOMBRES de evento, nunca respuestas, importes, CV ni resultados individuales.
export type AnalyticsEvent =
  | "match_view" | "analysis_started" | "analysis_completed"
  | "tool_open_entrevista" | "interview_started" | "interview_generated" | "whatsapp_click_entrevista"
  | "tool_open_salario" | "salary_started" | "salary_result_generated"
  | "tool_open_ninebox" | "ninebox_started" | "ninebox_result_generated"
  | "whatsapp_click";

declare global {
  interface Window {
    umami?: {
      track: (event: string) => Promise<void>;
    };
  }
}

const analyticsEnabled = Boolean(process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID);
const pendingEvents: AnalyticsEvent[] = [];
const sentOnce = new Set<AnalyticsEvent>();
let isReady = false;

// Respeta las señales de privacidad del navegador: "No rastrear" (DNT) y Global Privacy Control (GPC).
// Esto NO es un mecanismo de consentimiento: no hay banner ni registro de consentimiento.
export function analyticsOptedOut(): boolean {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string };
  const win = window as Window & { doNotTrack?: string };
  const dnt = nav.doNotTrack ?? win.doNotTrack ?? nav.msDoNotTrack;
  return nav.globalPrivacyControl === true || dnt === "1" || dnt === "yes";
}

function send(event: AnalyticsEvent) {
  if (!window.umami) return;
  try {
    void window.umami.track(event).catch(() => {});
  } catch {
    // Analytics must never interrupt the application.
  }
}

export function trackAnalyticsEvent(event: AnalyticsEvent) {
  if (!analyticsEnabled || typeof window === "undefined" || analyticsOptedOut()) return;
  if (isReady && window.umami) send(event);
  else pendingEvents.push(event);
}

// Para eventos que deben contarse una sola vez por carga de página (p. ej. "inicio de interacción").
export function trackAnalyticsEventOnce(event: AnalyticsEvent) {
  if (sentOnce.has(event)) return;
  sentOnce.add(event);
  trackAnalyticsEvent(event);
}

export function initializeAnalytics() {
  if (!window.umami) return;
  isReady = true;
  pendingEvents.splice(0).forEach(send);
}
