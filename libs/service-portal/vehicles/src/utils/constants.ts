import { Locale } from '@island.is/shared/types'

export const VEHICLE_OWNER = 'eigandi'
export const VEHICLE_COOWNER = 'meðeigandi'
export const VEHICLE_OPERATOR = 'umráðamaður'
export const LOCALE = 'is-IS'
export const getDateLocale = (locale: Locale) =>
  locale === 'en' ? 'en-US' : 'is-IS'
