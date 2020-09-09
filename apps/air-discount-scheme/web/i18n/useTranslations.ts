import { useContext, useEffect, useState } from 'react'

import { useI18n } from '.'
import { Locale } from '../types'
import { TranslationsContext } from './appWithTranslation'

const getLocale = (defaultLocale: Locale): Locale => {
  if (!process.browser) {
    return null
  }

  switch (localStorage.getItem('locale')) {
    case 'is':
      return 'is'
    case 'en':
      return 'en'
    default: {
      localStorage.removeItem('locale')
      return defaultLocale
    }
  }
}

const useTranslations = () => {
  const { activeLocale, switchLanguage } = useI18n()
  const [locale, setLocale] = useState('default')
  const language = getLocale(activeLocale)

  useEffect(() => {
    if (language || locale === 'default') {
      switchLanguage(null, language)
      setLocale(language)
    }
  }, [language])

  const translations = useContext(TranslationsContext)

  if (!translations) {
    throw new Error('Missing translation context')
  }
  return { t: translations[locale] }
}

export default useTranslations
