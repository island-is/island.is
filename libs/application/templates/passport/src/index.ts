import PassportTemplate from './lib/PassportTemplate'
export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')
export {PassportSchema} from './lib/dataSchema'

export default PassportTemplate
