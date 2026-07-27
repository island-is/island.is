/**
 * Stand-in for `next/router`, which reaches this SPA through library barrels
 * (portals/core -> island-ui/contentful -> shared/connected) even though no
 * Next.js-dependent component is ever rendered here. Throws loudly if one is.
 */
export const useRouter = (): never => {
  throw new Error('next/router is not available outside Next.js apps')
}

export default { useRouter }
