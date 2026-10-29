import template from './lib/mortgageCertificateTemplate'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export * from './lib/messages'

export default template
