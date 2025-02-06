import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['axios', 'ant-design-vue', 'json-bigint', 'vue'],
  noExternal: [],
  treeshake: true,
})
