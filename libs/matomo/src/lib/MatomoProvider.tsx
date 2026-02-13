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
