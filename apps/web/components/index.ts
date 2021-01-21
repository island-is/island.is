// Required ES6 syntax for TypeScript isolatedModules.
export * from './real'

// This module should never be imported for performance reasons. Instead
// import components from `@island.is/web/components`. Read
// `libs/shared/babel/README.md` for more details.
throw new Error(
  'Do not import web components from components/index.ts. Use `@island.is/web/components` instead.',
)
