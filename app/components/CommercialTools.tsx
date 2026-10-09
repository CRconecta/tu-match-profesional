import styles from "../commercialTools.module.css";

const WHATSAPP_BASE = "https://wa.me/5491124895402";

const navigation = [
  { href: "/", label: "Inicio" },
  { href: "/preparar-entrevista", label: "Preparar entrevista" },
  { href: "/salario", label: "Salario" },
  { href: "/recursos", label: "Recursos" },
];

const services = [
  {
    label: "Revisión profesional de CV",
    message: "Hola, quisiera consultar por el servicio pago de revisión de CV.",
  },
  {
    label: "Preparación individual de entrevistas",
    message: "Hola, quisiera consultar por el servicio pago de preparación individual de entrevistas.",
  },
  {
    label: "Asesoramiento laboral",
    message: "Hola, quisiera consultar por el servicio pago de asesoramiento laboral.",
  },
];

export function CommercialHeader({ current }: { current?: string }) {
  return (
    <header className={styles.header}>
      <div className={`shell ${styles.headerInner}`}>
        <a className={styles.brand} href="/" aria-label="CR Gestión con Resultados, Tu Match Profesional">
          <img src="/branding/logo-consultora.png" alt="CR Gestión con Resultados" />
          <span><strong>CR Gestión con Resultados</strong><small>Tu Match Profesional</small></span>
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
        <p>Tu Match Profesional es una iniciativa de CR Gestión con Resultados. Consultá por estos servicios pagos, sin compromiso.</p>
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
        <span>© CR Gestión con Resultados · Tu Match Profesional</span>
        <a href="/">Volver a Tu Match Profesional</a>
      </div>
    </footer>
  );
}
