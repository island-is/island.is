import template from './lib/drivingLicenseTemplate'
import { dataSchema } from './lib/dataSchema'

export const getDataProviders = () => import('./dataProviders/')

export const getFields = () => import('./fields/')

export default template
export { dataSchema }
export type { DrivingLicenseApplicationFor } from './lib/constants'
