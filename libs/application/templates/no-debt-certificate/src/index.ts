import template from './lib/noDebtCertificateTemplate'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export default template

export * from './lib/messages'
