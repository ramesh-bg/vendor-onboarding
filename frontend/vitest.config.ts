import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [],
    test: {
      environment: 'happy-dom',
      globals: true,
      include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
      // setupFiles: ["./vitest.setup.ts"], // Commented out to remove the reference
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  })
);
