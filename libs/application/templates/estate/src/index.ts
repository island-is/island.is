import EstateTemplate from './lib/EstateTemplate'
import { estateSchema } from './lib/dataSchema'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export default EstateTemplate
export { estateSchema }
