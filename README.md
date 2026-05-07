# NaturaTech LAC

Sitio frontend para NaturaTech LAC construido con React y Vite.

## Stack

- React 19
- Vite 6
- React Router 7
- GSAP 3 + ScrollTrigger
- SplitType
- Tailwind CSS 4
- Sharp para optimización de imágenes
- FFmpeg para optimización de video

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run optimize:images
npm run optimize:video
```

## Estructura

```text
src/
  App.jsx
  components/
  pages/
  style.css
public/
  assets/
scripts/
  optimize-images.mjs
  optimize-video.mjs
```

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

Los assets principales están en `public/assets`. El build de producción se genera en `dist`.