import React, { createContext, useEffect, useRef, useState } from 'react'
import rosetta from 'rosetta'

import { defaultLanguage } from '@island.is/shared/constants'
import { Locale } from '@island.is/shared/types'

export const isLocale = (x?: string): x is Locale => {
  return x === 'is' || x === 'en'
}

// Log and handle missing translations in development (also when running against mocks).
const wrapTranslations = <T extends { [key: string]: string }>(
  translations: T,
): T => {
  if (process.env.NODE_ENV === 'development' && typeof Proxy !== 'undefined') {
    const warnedKeys = {}
    return new Proxy(translations, {
      get(target: T, p: string): string {
        if (p in target) {
          return target[p]
        }
        if (!(p in warnedKeys)) {
          console.warn(`Missing translation for ${p}`)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          warnedKeys[p] = true
        }
        return p
      },
    })
  }
  return translations
}

const i18n = rosetta()
i18n.locale(defaultLanguage)

interface I18nContextType {
  activeLocale: Locale
  t: any
  locale: (locale: string, dict?: object) => void
}

export const I18nContext = createContext<I18nContextType | null>(null)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
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
    t: wrapTranslations(translations),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    locale: (l: string, dict) => {
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
