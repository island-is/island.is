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
    // Read environment variables
    const matomoDomain = process.env.NEXT_PUBLIC_MATOMO_DOMAIN
    const matomoSiteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID

    // Validate configuration
    if (!matomoDomain || !matomoSiteId) {
      console.warn(
        'Matomo tracking is not configured properly. Please check the NEXT_PUBLIC_MATOMO_DOMAIN and NEXT_PUBLIC_MATOMO_SITE_ID environment variables.',
      )
      return
    }

    // Prevent double initialization
    if (isInitializedRef.current) {
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

    // Load matomo.js script
    const script = document.createElement('script')
    script.async = true
    script.src = normalizedDomain + 'matomo.js'
    script.onerror = () => {
      console.error('Failed to load Matomo tracking script')
    }
    const firstScript = document.getElementsByTagName('script')[0]
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript)
    }

    // Cleanup function
    return () => {
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
    // Delay to allow children's effects to set attributes first
    setTimeout(() => {
      const attributes = attributesRef.current

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
    }, 0)
  }, [])

  // Track initial page load
  useEffect(() => {
    trackPageView(router.asPath)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Track route changes
  useEffect(() => {
    const handleRouteChangeStart = () => {
      clearAttributes()
    }

    const handleRouteChangeComplete = (url: string) => {
      trackPageView(url)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    return () => {
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
