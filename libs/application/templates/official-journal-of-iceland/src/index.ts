import OJOIApplicationTemplate from './lib/OJOIApplication'

export const getFields = () => import('./fields/')

export type { OJOIApplication } from './lib/types'
export { getMinistryFromSignature } from './utils/regulationValidations'
export default OJOIApplicationTemplate

export * from './hooks/useTypes'
