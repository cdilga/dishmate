import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  root: 'demo',
  base: '/dishmate/',
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
});
