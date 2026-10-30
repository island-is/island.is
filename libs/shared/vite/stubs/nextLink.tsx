import { cloneElement, createElement, forwardRef, isValidElement } from 'react'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

// Next's isAbsoluteUrl.
const ABSOLUTE_URL = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/

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
    passHref?: boolean
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
    passHref,
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
  // Like real next/link: inject href into the child anchor rather than wrap
  // it, which would nest anchors and drop the child's target and class.
  // The child keeps its own ref; Next ignores the outer one in legacy mode.
  if (
    legacyBehavior &&
    isValidElement<AnchorHTMLAttributes<HTMLAnchorElement>>(children)
  ) {
    // Unlike Next, an href the stub can't resolve leaves the child's own alone.
    const assignHref =
      resolvedHref !== undefined &&
      (ABSOLUTE_URL.test(resolvedHref) ||
        passHref ||
        (children.type === 'a' && !('href' in children.props)))
    return cloneElement(children, assignHref ? { href: resolvedHref } : {})
  }
  return createElement('a', { href: resolvedHref, ref, ...rest }, children)
})

export default Link
