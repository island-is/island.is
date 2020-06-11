import React, { createContext, useState, useRef, useEffect } from 'react'
import rosetta from 'rosetta'

import { Translation } from './locales/translation'

const i18n = rosetta()

export type Locale = 'is' | 'en'
export const defaultLanguage = 'is'

interface I18nContextType {
  activeLocale: string
  t: Translation
  locale: (locale: string, dict?: object) => void
}

interface PropTypes {
  children: React.ReactNode
  locale: Locale
  translations: Translation
}

export const I18nContext = createContext<I18nContextType | null>(null)

// default language
i18n.locale(defaultLanguage)

function I18n({ children, locale, translations }: PropTypes) {
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

export default I18n
