import template from './lib/template'
import { dataSchema } from './lib/dataSchema'
import { m } from './lib/messages'

export const getDataProviders = () => import('./dataProviders/')

export const getFields = () => import('./fields/')

export default template
export { dataSchema, m as messages }
export type { DrivingLicenseApplicationFor } from './utils/constants'
