'use client'

import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
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
 */
export const useMatomoPageView = (
  getAttributes: () => MatomoPageAttributes | undefined | null,
) => {
  const { setAttributes } = useMatomo()
  const router = useRouter()

  useEffect(() => {
    // Set attributes on initial mount
    const attrs = getAttributes()
    if (attrs) {
      setAttributes(attrs)
    }

    // Set attributes on route changes
    const handleRouteChange = () => {
      const attrs = getAttributes()
      if (attrs) {
        setAttributes(attrs)
      }
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events, setAttributes, getAttributes])
}

/**
 * Hook to set organization attribute for tracking
 */
export const useSetOrganization = (organization?: string | null) => {
  useMatomoPageView(() => ({ organization }))
}
