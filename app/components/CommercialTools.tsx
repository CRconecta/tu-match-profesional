import styles from "../commercialTools.module.css";

const WHATSAPP_BASE = "https://wa.me/5491124895402";

const navigation = [
  { href: "/", label: "Inicio" },
  { href: "/preparar-entrevista", label: "Prepará tu entrevista" },
  { href: "/salario", label: "Salario" },
  { href: "/radar-salarial", label: "Radar salarial" },
  { href: "/recursos", label: "Recursos" },
];

const services = [
  {
    label: "Revisión profesional de CV",
    message: "Hola, quisiera consultar por el servicio de revisión de CV.",
  },
  {
    label: "Preparación individual de entrevistas",
    message: "Hola, quisiera consultar por el servicio de preparación individual de entrevistas.",
  },
  {
    label: "Asesoramiento laboral",
    message: "Hola, quisiera consultar por el servicio de asesoramiento laboral.",
  },
];

export function CommercialHeader({ current }: { current?: string }) {
  return (
    <header className={styles.header}>
      <div className={`shell ${styles.headerInner}`}>
        <a className={styles.brand} href="/" aria-label="Tu Match Profesional — Una iniciativa de CR Gestión con Resultados">
          <img src="/branding/logo-cr-gestion.png" alt="CR Gestión con Resultados" />
          <span><strong>Tu Match Profesional</strong><small>Una iniciativa de CR Gestión con Resultados</small></span>
        </a>
        <nav className={styles.navigation} aria-label="Navegación principal">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} aria-current={current === item.href ? "page" : undefined}>{item.label}</a>
          ))}
        </nav>
        <details className={styles.mobileMenu}>
          <summary>Menú</summary>
          <nav aria-label="Navegación principal">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} aria-current={current === item.href ? "page" : undefined}>{item.label}</a>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}

export function CommercialCta() {
  return (
    <section className={styles.cta} aria-label="Servicios profesionales">
      <div>
        <div className="eyebrow">ACOMPAÑAMIENTO PROFESIONAL</div>
        <h2>Si necesitás un apoyo personalizado</h2>
        <p>Tu Match Profesional es una iniciativa de CR Gestión con Resultados. Consultá por estos servicios profesionales, sin compromiso.</p>
      </div>
      <ul>
        {services.map((service) => (
          <li key={service.label}>
            <a href={`${WHATSAPP_BASE}?text=${encodeURIComponent(service.message)}`} target="_blank" rel="noreferrer">{service.label} ↗</a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CommercialFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.footerInner}`}>
        <a className={styles.footerBrand} href="https://crgestion.netlify.app" target="_blank" rel="noopener noreferrer" aria-label="CR Gestión con Resultados, sitio institucional">
          <img src="/branding/logo-cr-gestion.png" alt="CR Gestión con Resultados" />
          <span>Tu Match Profesional — Una iniciativa de CR Gestión con Resultados</span>
        </a>
        <a href="/">Volver a Tu Match Profesional</a>
        <small>© 2026 CR Gestión de Personas &amp; Operaciones. Todos los derechos reservados. <a href="/terminos">Términos de uso</a></small>
      </div>
    </footer>
  );
}
