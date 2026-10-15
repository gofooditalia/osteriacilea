# CLAUDE.md — Osteria Cilea

Sito one-page di **Osteria Cilea** (Via Francesco Cilea 79, 90144 Palermo). Cliente di GO!Food Italia (Giorgio Di Martino).
Comunicazione con Giorgio: **in italiano**, diretta, niente giri di parole.

- Repo: https://github.com/gofooditalia/osteriacilea (branch `main`)
- Produzione: https://www.osteriacilea.it (dominio primario; `osteriacilea.it` fa redirect 307 a `www`) — deploy automatico su **Vercel** a ogni push su `main`
- Credits nel footer: "Developed by" + logo GO!Food Italia → https://gofoodmenu.it (non usare il nome personale)

## Stack

- **Astro 5** (`astro.config.mjs`) con adapter `@astrojs/vercel`; nessuna pagina SSR, tutto statico
- **Tailwind CSS 4** via `@tailwindcss/vite`; tema definito in `src/styles/global.css` (`@theme`)
- Icone: `lucide-astro` (+ Material Symbols da Google Fonts per 2 icone)
- TypeScript strict (`astro/tsconfigs/strict`)
- Comandi: `npm run dev` (localhost:4321), `npm run build`, `npm run preview`

## Struttura

```
src/layouts/Layout.astro      head, favicon, font, SplashScreen
src/pages/index.astro         unica pagina: Navbar → Hero → About → Specials → Gallery → Reviews → MenuCTA → Footer
src/components/
  Navbar.astro                navbar fissa (si scurisce allo scroll) + menu mobile a scorrimento
  Hero.astro       #home      video di sfondo (hero-bg.mp4 desktop / hero-bg-mobile.mp4 mobile), poster hero-bg.webp
  About.astro      #osteria   storia (Davide e Giusy) + foto
  Specials.astro   #specials  3 piatti del giorno con prezzi (array hardcoded)
  Gallery.astro    #gallery   masonry di 27 foto (array hardcoded, file in public/gallery/)
  Reviews.astro    #recensioni 6 recensioni reali Google/TheFork (array hardcoded; niente schema Review: self-serving non ammesso da Google)
  MenuCTA.astro    #prenota   CTA prenotazione (Google Reserve) + slideshow sfondo mobile / immagine fissa desktop
  Footer.astro     #contatti  orari, contatti, mappa Google embed, social, credits
  SplashScreen.astro          overlay logo all'avvio (~1–1.5s + 0.8s fade)
public/                       asset statici (~18 MB: video hero 8 MB + 5.6 MB, gallery 3 MB)
```

## Dati e link chiave

- Telefono: +39 392 592 2651 (ripetuto a mano in Footer e MenuCTA)
- Instagram: https://www.instagram.com/osteriacilea/ — Facebook: profile.php?id=61585332472816
- Menu: `/menu` → redirect 302 a https://gofoodmenu.it/osteria-cilea (definito in `astro.config.mjs`)
- Prenotazioni: link Google Reserve in `MenuCTA.astro`
- Google Maps: https://maps.app.goo.gl/q6tiBoJyQDYVJGnv9 — Lascia recensione: https://g.page/r/CQ-qVW7iWy7TEBM/review
- Orari (Footer): 12:30–15:00 / 19:30–23:00, martedì chiuso

## Design

- Colori (`global.css`): primary `#ec3713` (rosso), olive `#556b2f`, bg-light `#fdfaf6`, bg-dark `#1a0f0d`, testo `#181211`; testo secondario `#896861` (hardcoded)
- Font effettivi: **Noto Serif** (`font-display`) e Noto Sans da Google Fonts. Playball/Montserrat sono importati via Fontsource ma non usati.
- Le classi `dark:` sono presenti e seguono `prefers-color-scheme` (nessun toggle).

## Problemi noti / backlog (analisi 15/10/2026)

SEO
- [x] `<h1>` nell'hero (con prefisso `sr-only` "Osteria Cilea…"); footer `h4` → `h3`
- [x] Canonical, Open Graph/Twitter (`public/og-image.jpg` 1200×630), JSON-LD `Restaurant` in `Layout.astro` (`site` in astro.config)
- [x] Dominio primario `www.osteriacilea.it` ovunque (verificato 15/10/2026)
- [ ] Dopo il deploy: verificare con Google Rich Results Test

Performance
- [ ] SplashScreen ritarda la visualizzazione di 1,5–2,3 s a ogni visita (LCP)
- [ ] Font inutili: rimuovere import Fontsource non usati; Material Symbols (font intero) usato solo per `arrow_forward` ed `event` → sostituire con Lucide
- [ ] Import `Image` inutilizzato in `Hero.astro`; immagini senza `width`/`height` (CLS), nessun uso di `astro:assets`
- [ ] Video hero pesanti (8 MB / 5.6 MB)

Contenuti / UX / accessibilità
- [ ] Orari contraddittori: "Lunedì - Domenica" + "Martedì: Chiuso"
- [ ] Privacy Policy e Termini puntano a `#` (serve almeno privacy/cookie policy: mappa Google embed)
- [ ] Telefono in MenuCTA non cliccabile (`tel:`)
- [ ] Link social senza `aria-label` e `rel="noopener noreferrer"`
- [ ] Verificare resa in dark mode su mobile

Pulizia
- [ ] File residui in root: `stitch_home.html` (mockup iniziale) e `menu-osteria-cilea.pdf`
- [ ] README cita tipografia Playball/Montserrat (non più vera)

## Convenzioni

- Commit in stile conventional (`feat:`, `fix:`, `style:`, `perf:`, `chore:`, `docs:`), messaggi in inglese
- Immagini in WebP, nomi `cilea-<orientamento>-<piatto>.webp` (`vertic`/`orizz`)
- Testi del sito in italiano
