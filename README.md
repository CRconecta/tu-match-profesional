# Gestión con Resultados — Tu Match Profesional

Analizá qué tan bien responde tu CV a una oferta laboral antes de postularte.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abrí <http://localhost:3000>. El servidor escucha en `0.0.0.0:3000` para que
también funcione dentro de Codespaces.

## Acceso desde GitHub Codespaces

El único puerto necesario es el `3000`. En la pestaña **Ports**, configurá su
visibilidad como **Public** y abrí la URL `https://<codespace>-3000.app.github.dev`.
Los puertos `3001` y `3002` no son necesarios para esta aplicación.

El enlace de Codespaces depende de que el Codespace esté activo. Para un enlace
permanente, usá el despliegue de Vercel que se describe abajo.

## Funcionalidad

- Pegado o lectura de un aviso laboral desde una URL pública.
- Carga de CV en PDF, DOCX o TXT, hasta 8 MB.
- Extracción de texto y diagnóstico determinístico de coincidencias.
- Análisis semántico opcional mediante OpenAI.
- Brechas, evidencia encontrada y recomendaciones concretas.

## Variables de entorno opcionales

La aplicación funciona sin claves externas usando el análisis determinístico.
Para habilitar el análisis semántico, configurá en `.env.local` o en Vercel:

```env
OPENAI_API_KEY=tu_clave
OPENAI_MODEL=gpt-4o-mini
# Opcional para un proveedor compatible:
# OPENAI_BASE_URL=https://api.openai.com/v1
```

No subas `.env.local` ni claves al repositorio.

## Desplegar en Vercel

1. Importá el repositorio `tu-match-profesional` en Vercel.
2. Conservá los valores por defecto de Next.js.
3. Configurá `OPENAI_API_KEY` solo si querés habilitar el análisis con IA.
4. Vercel ejecutará `npm run build` y entregará una URL pública permanente.

El logo de la consultora se sirve desde `public/branding/logo-consultora.png`.
