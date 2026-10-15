# CLAUDE.md — Osteria Cilea

Sito one-page di **Osteria Cilea** (Via Francesco Cilea 79, 90144 Palermo). Cliente di GO!Food Italia (Giorgio Di Martino).
Comunicazione con Giorgio: **in italiano**, diretta, niente giri di parole.

- Repo: https://github.com/gofooditalia/osteriacilea (branch `main`)
- Produzione: https://www.osteriacilea.it (dominio primario; `osteriacilea.it` e `osteriacilea.vercel.app` fanno redirect 308 permanente a `www`, impostato su Vercel → Settings → Domains) — deploy automatico su **Vercel** a ogni push su `main`
- Credits nel footer: "Developed by" + logo GO!Food Italia → https://gofoodmenu.it (non usare il nome personale)
- Titolare: Davide Terrasi (ditta individuale), sede legale Via Don Michele Rua 1, 90124 Palermo, P.IVA 07367400822 (in footer e /privacy), email osteriacilea@gmail.com, PEC osteriacilea@pec.it. Non pubblicare codice fiscale
- URL senza slash finale (`trailingSlash: 'never'`)

## Stack

- **Astro 5** (`astro.config.mjs`) con adapter `@astrojs/vercel`; nessuna pagina SSR, tutto statico
- **Tailwind CSS 4** via `@tailwindcss/vite`; tema definito in `src/styles/global.css` (`@theme`)
- Icone: solo `lucide-astro`
- TypeScript strict (`astro/tsconfigs/strict`)
- Comandi: `npm run dev` (localhost:4321), `npm run build`, `npm run preview`
- `npm run build` esegue anche `scripts/fix-vercel-asset-cache.mjs`: workaround per `@astrojs/vercel` 9.x che mette la regola `immutable` di `/_astro/` dopo `handle: filesystem` (header mai applicato). Rimuoverlo se si aggiorna l'adapter e il bug è risolto

## Struttura

```
src/layouts/Layout.astro      head, favicon, font, SplashScreen
src/pages/index.astro         home: Navbar → Hero → About → Specials → Gallery → Reviews → MenuCTA → Footer
src/pages/privacy.astro       privacy e cookie policy (Layout con splash={false})
src/components/
  Navbar.astro                navbar fissa (si scurisce allo scroll) + menu mobile a scorrimento
  Hero.astro       #home      poster <picture> (hero-poster*.webp = 1° frame) + video caricato via JS dopo load (hero-bg.mp4 / hero-bg-mobile.mp4)
  About.astro      #osteria   storia (Davide e Giusy) + foto
  Specials.astro   #specials  3 piatti del giorno con prezzi (array hardcoded)
  Gallery.astro    #gallery   masonry di 27 foto (array di nomi file → src/assets/gallery/ via import.meta.glob)
  Reviews.astro    #recensioni 6 recensioni reali Google/TheFork (array hardcoded; niente schema Review: self-serving non ammesso da Google)
  MenuCTA.astro    #prenota   form WhatsAppBooking (principale) + link Google Reserve/TheFork + telefono; slideshow sfondo mobile / immagine fissa desktop
  WhatsAppBooking.astro       form prenotazione → apre wa.me/393925922651 con messaggio precompilato (nessun backend, nessun dato salvato). Fasce orarie arrivo: 12:30–14:15 / 19:30–22:15
  Footer.astro     #contatti  orari, contatti, mappa Google embed, social, credits
  SplashScreen.astro          overlay logo solo alla prima visita della sessione (0.6s + 0.4s fade)
public/                       asset statici (video hero ~4 MB in tutto, gallery 3 MB)
```

## Dati e link chiave

- Telefono: +39 392 592 2651 (ripetuto a mano in Footer e MenuCTA)
- Instagram: https://www.instagram.com/osteriacilea/ — Facebook: profile.php?id=61585332472816
- Menu: `/menu` → redirect 302 a https://gofoodmenu.it/osteria-cilea (definito in `astro.config.mjs`)
- Prenotazioni: form WhatsApp (principale) + Google Reserve (fornitore TheFork) in `MenuCTA.astro`
- Google Maps: https://maps.app.goo.gl/q6tiBoJyQDYVJGnv9 — Lascia recensione: https://g.page/r/CQ-qVW7iWy7TEBM/review
- Orari: fonte = scheda Google Business. Aperti tutti i giorni 12:30–15:00 / 19:30–23:00 (direttiva del gestore, Google aggiornato il 15/10/2026). Fascia prezzo Google: 10-20 € a persona. Ripetuti in Footer e JSON-LD (Layout.astro)

## Design

- Colori (`global.css`): primary `#ec3713` (rosso), olive `#556b2f` (in dark mode `olive-light` `#9cb86a` per testo/bordi), bg-light `#fdfaf6`, bg-dark `#1a0f0d`, testo `#181211`; testo secondario `#896861` (hardcoded)
- Font: solo **Noto Serif** (`font-display`, 400/700/400 italic) self-hosted via `@fontsource/noto-serif`
- Le classi `dark:` sono presenti e seguono `prefers-color-scheme` (nessun toggle).

## Problemi noti / backlog (analisi 15/10/2026)

SEO
- [x] `<h1>` nell'hero (con prefisso `sr-only` "Osteria Cilea…"); footer `h4` → `h3`
- [x] Canonical, Open Graph/Twitter (`public/og-image.jpg` 1200×630), JSON-LD `Restaurant` in `Layout.astro` (`site` in astro.config)
- [x] Dominio primario `www.osteriacilea.it` ovunque (verificato 15/10/2026)
- [x] Rich Results Test superato (15/10/2026): Local Business + Organization validi, nessun errore

Performance
- [x] SplashScreen: solo prima visita della sessione (`sessionStorage` `cilea-splash`), ~1 s totale, saltato con `prefers-reduced-motion`
- [x] Font: rimossi Fontsource (Playball/Montserrat), Noto Sans e Material Symbols (1,1 MB) → icone Lucide
- [x] Gallery/Specials/About con `<Image>` di `astro:assets` (width/height automatici + srcset); foto in `src/assets/`
- [x] Video hero ricompressi (2,0 MB 720p / 1,9 MB 540×960 30fps), caricati dopo `load` dietro poster `<picture>`; niente video con reduced-motion/Save-Data

Contenuti / UX / accessibilità
- [x] Orari allineati a Google, blocco orari del footer linka alla scheda Maps
- [x] Pagina `/privacy` (privacy + cookie policy, art. 13 GDPR) — bozza da far verificare a un consulente; "Termini e Condizioni" rimosso (nessuna vendita online)
- [x] Nessuna risorsa esterna al caricamento: Noto Serif self-hosted (Fontsource), mappa Google caricata solo al clic → niente banner cookie. Se si aggiunge un servizio terzo (analytics, pixel, embed) va aggiornata la policy e serve un banner di consenso
- [x] Telefono in MenuCTA cliccabile
- [x] Link social con `aria-label` e `rel`; iframe mappa con `title`
- [x] Dark mode su mobile verificata (15/10/2026): pulsanti outline oliva schiariti con `olive-light`

Pulizia
- [x] Rimossi file residui (`stitch_home.html`, `menu-osteria-cilea.pdf`) e le 4 foto inutilizzate di `public/gallery/`
- [x] README tipografia aggiornata

## Convenzioni

- Commit in stile conventional (`feat:`, `fix:`, `style:`, `perf:`, `chore:`, `docs:`), messaggi in inglese
- Immagini in WebP, nomi `cilea-<orientamento>-<piatto>.webp` (`vertic`/`orizz`); quelle di contenuto vanno in `src/assets/` e si usano con `<Image>` (non in `public/`)
- Testi del sito in italiano
