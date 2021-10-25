import * as ref from '../styles/global.css'

// With [deep imports](/libs/shared/babel/README.md), the only way to load
// `global.treat` styles is to import something that depends on it.
//
// This function doesn't need to do anything except refer to the global.treat
// module so it isn't tree-shaken.
export const globalStyles = () => {
  return ref
}
