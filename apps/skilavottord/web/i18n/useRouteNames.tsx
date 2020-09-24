import { Locale, defaultLanguage } from './I18n'

const routeNames = {
  is: {
    home: '',
    myCars: 'my-cars',
    recyclingCompanies: 'recycling-companies',
    recycleVehicle: 'recycle-vehicle',
  },
  en: {
    home: '',
    myCars: 'my-cars',
    recyclingCompanies: 'recycling-companies',
    recycleVehicle: 'recycle-vehicle',
  },
}

export type PathTypes =
  | 'home'
  | 'myCars'
  | 'recyclingCompanies'
  | 'recycleVehicle'

export const useRouteNames = (locale: Locale = defaultLanguage) => {
  return {
    makePath: (type?: PathTypes, subfix?: string, step?: string) => {
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

      if (step) {
        path += '/' + step
      }

      return path || '/'
    },
  }
}

export default useRouteNames
