import React, { createContext, useState, useRef, useEffect } from 'react'
import rosetta, { Rosetta } from 'rosetta'

export type Locale = 'is' | 'en'
export const defaultLanguage: Locale = 'is'

export const isLocale = (x: string): x is Locale => {
  return x === 'is' || x === 'en'
}

const i18n = rosetta()
i18n.locale(defaultLanguage)

interface I18nContextType {
  activeLocale: Locale
  t: any
  locale: (locale: string, dict?: object) => void
}

export const I18nContext = createContext<I18nContextType | null>(null)

export default function I18n({ children, locale, translations }) {
  const [activeDict, setActiveDict] = useState(() => translations)
  const activeLocaleRef = useRef(locale || defaultLanguage)
  const [, setTick] = useState(0)
  const firstRender = useRef(true)

  // for initial SSR render
  if (locale && firstRender.current === true) {
    firstRender.current = false
    i18n.locale(locale)
    i18n.set(locale, activeDict)
  }

  useEffect(() => {
    if (locale) {
      i18n.locale(locale)
      i18n.set(locale, activeDict)
      activeLocaleRef.current = locale
      // force rerender
      setTick((tick) => tick + 1)
    }
  }, [locale, activeDict])

  const i18nWrapper = {
    activeLocale: activeLocaleRef.current,
    t: translations,
    locale: (l, dict) => {
      i18n.locale(l)
      activeLocaleRef.current = l
      if (dict) {
        i18n.set(l, dict)
        setActiveDict(dict)
      } else {
        setTick((tick) => tick + 1)
      }
    },
  }

  return (
    <I18nContext.Provider value={i18nWrapper}>{children}</I18nContext.Provider>
  )
}
