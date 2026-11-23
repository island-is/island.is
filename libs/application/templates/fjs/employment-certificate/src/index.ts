import template from './lib/template'

export const getFields = () => import('./fields/')

export * from './lib/types'
export { YES } from './utils/constants'
export { errors as employmentCertificateErrors } from './lib/messages'
export * as employmentCertificateMessages from './lib/messages'

export default template
