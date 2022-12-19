import ParentalLeaveTemplate from './lib/ParentalLeaveTemplate'

export const getDataProviders = () => import('./dataProviders/')

export const getFields = () => import('./fields/')

export default ParentalLeaveTemplate

export * from './lib/parentalLeaveUtils'
export {
  calculatePeriodLength,
  calculateRemainingNumberOfDays,
} from './lib/directorateOfLabour.utils'
export * from './constants'
export * from './types'
export * from './lib/messages'
