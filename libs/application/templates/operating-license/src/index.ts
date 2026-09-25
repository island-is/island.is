import OperatingLicenseTemplate from './lib/OperatingLicenseTemplate'
export { error } from './lib/error'
export const getDataProviders = () => import('./dataProviders')
export const getFields = () => import('./fields')

export * from './lib/messages'

export default OperatingLicenseTemplate
