import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(async () => {
  const plugins = [
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(js|css|html)$/,
            handler: 'CacheFirst',
          },
        ],
      },
      manifest: false, // We provide our own manifest.json
    }),
  ];

  if (process.env.BUNDLE_REPORT) {
    const { visualizer } = await import('rollup-plugin-visualizer');
    plugins.push(visualizer({ open: true, filename: 'dist-demo/stats.html' }));
  }

  return {
    root: 'demo',
    base: '/dishmate/',
    plugins,
    resolve: {
      alias: {
        'dishmate': resolve(__dirname, 'src'),
      },
    },
    build: {
      outDir: resolve(__dirname, 'dist-demo'),
      emptyOutDir: true,
    },
    server: {
      open: true,
    },
  };
});
