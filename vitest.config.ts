import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['packages/**/__tests__/**/*.test.js', 'packages/**/?(*.)+(spec|test).[jt]s?(x)'],
  },
});