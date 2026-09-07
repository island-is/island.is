import { createElement, forwardRef } from 'react'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

/**
 * Stand-in for `next/link` for the SPAs, where island-ui's Link components
 * are bundled through barrels but only ever rendered for external URLs.
 * Renders a plain anchor so any accidental usage still navigates.
 */
const Link = forwardRef<
  HTMLAnchorElement,
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href?: string | { pathname?: string }
    children?: ReactNode
    legacyBehavior?: boolean
    prefetch?: boolean
    shallow?: boolean
    scroll?: boolean
    replace?: boolean
    as?: unknown
    locale?: unknown
  }
>(function NextLinkStub(
  {
    href,
    children,
    legacyBehavior,
    prefetch,
    shallow,
    scroll,
    replace,
    as,
    locale,
    ...rest
  },
  ref,
) {
  const resolvedHref = typeof href === 'string' ? href : href?.pathname
  return createElement('a', { href: resolvedHref, ref, ...rest }, children)
})

export default Link
