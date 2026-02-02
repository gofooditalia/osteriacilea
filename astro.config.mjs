// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  redirects: {
    '/menu': {
      destination: 'https://gofoodmenu.it/osteria-cilea',
      status: 302
    }
  },
  vite: {
    plugins: [tailwindcss()]
  }
});