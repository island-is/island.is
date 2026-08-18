// Vite-style explicit URL import for svg assets (also understood by webpack,
// which strips resource queries before running loaders).
declare module '*.svg?url' {
  const src: string
  export default src
}
