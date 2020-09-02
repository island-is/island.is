import { Locale, defaultLanguage } from './I18n'

const routeNames = {
  is: {
    home: '',
    companies: 'recycling-companies',
    myPage: 'my-page',
  },
  en: {
    home: '',
    companies: 'recycling-companies',
    myPage: 'my-page',
  },
}

export type PathTypes =
  | 'home'
  | 'companies'
  | 'myPage'

export const useRouteNames = (locale: Locale = defaultLanguage) => {
  return {
    makePath: (type?: PathTypes, subfix?: string) => {
      let path = ''

      const typePath = (type && routeNames[locale][type]) ?? null

      if (locale && locale !== defaultLanguage) {
        path += '/' + locale
      }

      if (typePath) {
        path += '/' + typePath
      }

      if (subfix) {
        path += '/' + subfix
      }

      return path || '/'
    },
  }
}

export default useRouteNames
