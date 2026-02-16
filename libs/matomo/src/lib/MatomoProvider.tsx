'use client'

import React, {
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type MutableRefObject,
} from 'react'
import { useRouter } from 'next/router'
import { MatomoContext } from './MatomoContext'
import { push } from './push'
import type { MatomoPageAttributes, MatomoContextValue } from './types'

interface MatomoProviderProps {
  children: ReactNode
}

export const MatomoProvider = ({ children }: MatomoProviderProps) => {
  const router = useRouter()
  const attributesRef: MutableRefObject<MatomoPageAttributes> = useRef({})
  const isInitializedRef = useRef(false)

  useEffect(() => {
    console.log('[Matomo] Init effect running')

    // Read environment variables
    const matomoDomain = process.env.NEXT_PUBLIC_MATOMO_DOMAIN
    const matomoSiteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID

    console.log('[Matomo] Config:', { matomoDomain, matomoSiteId })

    // Validate configuration
    if (!matomoDomain || !matomoSiteId) {
      console.warn(
        'Matomo tracking is not configured properly. Please check the NEXT_PUBLIC_MATOMO_DOMAIN and NEXT_PUBLIC_MATOMO_SITE_ID environment variables.',
      )
      return
    }

    // Prevent double initialization
    if (isInitializedRef.current) {
      console.log('[Matomo] Already initialized, skipping')
      return
    }
    isInitializedRef.current = true

    // Normalize domain (ensure trailing slash)
    const normalizedDomain = matomoDomain.endsWith('/')
      ? matomoDomain
      : `${matomoDomain}/`

    // Initialize Matomo
    window._paq = window._paq || []
    window._paq.push(['setTrackerUrl', normalizedDomain + 'matomo.php'])
    window._paq.push(['setSiteId', matomoSiteId])
    window._paq.push(['enableLinkTracking'])

    console.log('[Matomo] Initialized _paq, loading script from:', normalizedDomain + 'matomo.js')

    // Load matomo.js script
    const script = document.createElement('script')
    script.async = true
    script.src = normalizedDomain + 'matomo.js'
    script.onerror = () => {
      console.error('[Matomo] Failed to load Matomo tracking script')
    }
    script.onload = () => {
      console.log('[Matomo] matomo.js loaded successfully')
    }
    const firstScript = document.getElementsByTagName('script')[0]
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript)
    }

    // Cleanup function
    return () => {
      console.log('[Matomo] Cleanup: removing script')
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      isInitializedRef.current = false
    }
  }, [])

  const setAttribute = useCallback(
    <K extends keyof MatomoPageAttributes>(
      key: K,
      value: MatomoPageAttributes[K],
    ) => {
      attributesRef.current[key] = value
    },
    [],
  )

  const setAttributes = useCallback((attributes: MatomoPageAttributes) => {
    Object.assign(attributesRef.current, attributes)
  }, [])

  const getAttributes = useCallback(() => {
    return { ...attributesRef.current }
  }, [])

  const clearAttributes = useCallback(() => {
    attributesRef.current = {}
  }, [])

  const trackPageView = useCallback((url: string) => {
    console.log('[Matomo] trackPageView called with url:', url)
    // Delay to allow children's effects to set attributes first
    setTimeout(() => {
      const attributes = attributesRef.current
      console.log('[Matomo] trackPageView executing (after setTimeout) for:', url, 'attributes:', attributes)

      // Set custom URL
      push(['setCustomUrl', url])

      // Set document title
      push(['setDocumentTitle', document.title])

      // Set custom dimensions/variables from attributes
      Object.entries(attributes).forEach(([key, value]) => {
        if (value !== undefined) {
          push(['setCustomVariable', 1, key, String(value), 'page'])
        }
      })

      // Track the page view
      push(['trackPageView'])
      console.log('[Matomo] trackPageView push complete for:', url)
    }, 0)
  }, [])

  // Track initial page load
  useEffect(() => {
    console.log('[Matomo] Initial page load effect, router.asPath:', router.asPath)
    trackPageView(router.asPath)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Track route changes
  useEffect(() => {
    console.log('[Matomo] Setting up route change listeners on router.events:', typeof router.events, router.events)

    const handleRouteChangeStart = () => {
      console.log('[Matomo] routeChangeStart fired, clearing attributes')
      clearAttributes()
    }

    const handleRouteChangeComplete = (url: string) => {
      console.log('[Matomo] routeChangeComplete fired with url:', url)
      trackPageView(url)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    return () => {
      console.log('[Matomo] Cleaning up route change listeners')
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [router.events, clearAttributes, trackPageView])

  const contextValue: MatomoContextValue = {
    setAttribute,
    setAttributes,
    getAttributes,
  }

  return (
    <MatomoContext.Provider value={contextValue}>
      {children}
    </MatomoContext.Provider>
  )
}
