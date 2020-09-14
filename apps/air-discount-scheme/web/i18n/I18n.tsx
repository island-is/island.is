import React, { createContext, useState, useRef, useEffect } from 'react'
import Router from 'next/router'
import rosetta from 'rosetta'

import { getRoute } from './routes'
import { Locale, Routes } from '../types'
import { LOCALE_KEY } from '../consts'

const i18n = rosetta()

export const defaultLanguage: Locale = 'is'

interface I18nContextType {
  activeLocale: Locale
  switchLanguage: (route: ValueOf<Routes>, locale: Locale) => void
  toRoute: (route: keyof Routes, locale?: Locale) => string
}

interface PropTypes {
  children: React.ReactNode
  localeKey: Locale
}

export const I18nContext = createContext<I18nContextType | null>(null)

// default language
i18n.locale(defaultLanguage)

function I18n({ children, localeKey }: PropTypes) {
  const activeLocaleRef = useRef(localeKey || defaultLanguage)
  const [, setTick] = useState(0)
  const firstRender = useRef(true)

  // for initial SSR render
  if (localeKey && firstRender.current === true) {
    firstRender.current = false
    i18n.locale(localeKey)
  }

  useEffect(() => {
    const locale = localStorage.getItem(LOCALE_KEY) ?? localeKey
    if (locale) {
      i18n.locale(locale)
      activeLocaleRef.current = locale as Locale
      // force rerender
      setTick((tick) => tick + 1)
    }
  }, [localeKey])

  const i18nWrapper = {
    activeLocale: activeLocaleRef.current,
    toRoute: (
      route: keyof Routes,
      locale: Locale = activeLocaleRef.current,
    ): string => getRoute(locale, route),
    switchLanguage: (route: ValueOf<Routes>, language: Locale): void => {
      localStorage.setItem(LOCALE_KEY, language)
      if (route) {
        Router.push(route)
      } else {
        i18n.locale(language)
        activeLocaleRef.current = language
        setTick((tick) => tick + 1)
      }
    },
  }

  return (
    <I18nContext.Provider value={i18nWrapper}>{children}</I18nContext.Provider>
  )
}

export default I18n
