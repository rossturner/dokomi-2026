import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/dokomi-2026/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'convention.json'],
      manifest: {
        name: 'DoKomi Invitees',
        short_name: 'DoKomi',
        description: 'Convention day reminder for DoKomi 2026 outreach shortlist',
        theme_color: '#1a1a1a',
        background_color: '#121212',
        display: 'standalone',
        start_url: '/dokomi-2026/',
        scope: '/dokomi-2026/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,json}'],
        navigateFallback: '/dokomi-2026/index.html',
      },
    }),
  ],
  test: { environment: 'jsdom' },
});
