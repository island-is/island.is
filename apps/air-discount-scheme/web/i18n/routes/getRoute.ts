import { Locale, Routes } from '../../types'
import icelandicRoutes from './is'
import englishRoutes from './en'

const getLocaleRoutes = (locale: Locale) => {
  switch (locale) {
    case 'is':
      return icelandicRoutes
    case 'en':
      return englishRoutes
    default:
      return icelandicRoutes
  }
}

export default (locale: Locale, route: keyof Routes): string => {
  const localeRoutes = getLocaleRoutes(locale)
  return localeRoutes[route]
}
