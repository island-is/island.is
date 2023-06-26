/* eslint-disable */
// Taken here: https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export#syntax

// Exporting individual features
export let name1 = 1
export let name2 = 2
export function functionName() {}
export class ClassName {}

// Export list
const name3 = 3
const name4 = 4
export { name3, name4 }

// Renaming exports
const variable1 = 1
const variable2 = 2
export { variable1 as name5, variable2 as name6 }

// Exporting destructured assignments with renaming
const o = { name7: 7, hello: 8 }
export const { name7, hello: name8 } = o

// Default exports
export default function ignored() {}
export { o as default }

// Aggregating modules
export * from './a' // does not set the default export
// export * as name11 from './a' // Draft ECMAScript® 2O21 - Not supported atm.
export { name12, name13 } from './b'
export { a as name14, b as name15, b as default } from './c'
export { default } from './d'
export { default as name16 } from './d'

// Nested
export * from './e'
