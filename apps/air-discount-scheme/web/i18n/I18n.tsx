import React, { createContext, useState, useRef, useEffect } from 'react'
import rosetta from 'rosetta'

import { getRoute } from './routes'
import { Locale, Routes } from './types'

const i18n = rosetta()

export const defaultLanguage = 'is'

interface I18nContextType {
  activeLocale: Locale
  locale: (locale: Locale) => void
  toRoute: (route: keyof Routes, locale?: Locale) => string
}

interface PropTypes {
  children: React.ReactNode
  locale: Locale
}

export const I18nContext = createContext<I18nContextType | null>(null)

// default language
i18n.locale(defaultLanguage)

function I18n({ children, locale }: PropTypes) {
  const activeLocaleRef = useRef(locale || defaultLanguage)
  const [, setTick] = useState(0)
  const firstRender = useRef(true)

  // for initial SSR render
  if (locale && firstRender.current === true) {
    firstRender.current = false
    i18n.locale(locale)
  }

  useEffect(() => {
    if (locale) {
      i18n.locale(locale)
      activeLocaleRef.current = locale
      // force rerender
      setTick((tick) => tick + 1)
    }
  }, [locale])

  const i18nWrapper = {
    activeLocale: activeLocaleRef.current,
    toRoute: (
      route: keyof Routes,
      locale: Locale = activeLocaleRef.current,
    ): string => getRoute(locale, route),
    locale: (l) => {
      i18n.locale(l)
      activeLocaleRef.current = l
      setTick((tick) => tick + 1)
    },
  }

  return (
    <I18nContext.Provider value={i18nWrapper}>{children}</I18nContext.Provider>
  )
}

export default I18n
