import DrivingLicenseTemplate from './lib/drivingLicenseTemplate'
import { dataSchema } from './lib/dataSchema'

export const getDataProviders = () => import('./dataProviders/')

export const getFields = () => import('./fields/')

export default DrivingLicenseTemplate
export { dataSchema }
