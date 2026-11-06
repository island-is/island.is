export * from './lib/utils'
export * from './lib/types'
// Named re-exports because regulations-tools is CommonJS, and Vite's dev
// server drops named exports passed through `export *` from a CJS module.
export {
  getDiff,
  getTextContentDiff,
  HTMLDump,
  toHTML,
} from '@dmr.is/regulations-tools/html'
export type { HTMLDumpProps } from '@dmr.is/regulations-tools/html'
