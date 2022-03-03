import ParentalLeaveTemplate from './lib/ParentalLeaveTemplate'

export const getDataProviders = () => import('./dataProviders/')

export const getFields = () => import('./fields/')

export default ParentalLeaveTemplate

export * from './constants'
export { calculatePeriodLength } from './lib/directorateOfLabour.utils'
export * from './lib/parentalLeaveUtils'
export * from './types'
