'use client'

import { useContext, useEffect } from 'react'
import Router from 'next/router'
import { MatomoContext } from './MatomoContext'
import type { MatomoPageAttributes, MatomoContextValue } from './types'

/**
 * Hook to access Matomo tracking context
 */
export const useMatomo = (): MatomoContextValue => {
  const context = useContext(MatomoContext)
  if (!context) {
    throw new Error('useMatomo must be used within a MatomoProvider')
  }
  return context
}

/**
 * Hook that sets attributes on mount and on every route change while component is mounted.
 * Attributes are set before MatomoProvider sends the page view.
 * Return undefined or null to skip setting attributes.
 *
 * Uses the Router singleton instead of useRouter() hook to avoid
 * triggering React state updates during hydration.
 */
export const useMatomoPageView = (
  getAttributes: () => MatomoPageAttributes | undefined | null,
) => {
  const { setAttributes } = useMatomo()

  useEffect(() => {
    // Set attributes on initial mount
    const attrs = getAttributes()
    console.log('[Matomo] useMatomoPageView: initial mount, attrs:', attrs)
    if (attrs) {
      setAttributes(attrs)
    }

    // Set attributes on route changes
    const handleRouteChange = () => {
      const attrs = getAttributes()
      console.log(
        '[Matomo] useMatomoPageView: routeChangeComplete, attrs:',
        attrs,
      )
      if (attrs) {
        setAttributes(attrs)
      }
    }

    Router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [setAttributes, getAttributes])
}

/**
 * Hook to set organization attribute for tracking
 */
export const useSetOrganization = (organization?: string | null) => {
  useMatomoPageView(() => ({ organization }))
}
