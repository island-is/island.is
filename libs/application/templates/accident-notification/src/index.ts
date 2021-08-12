import AccidentNotificationTemplate from './lib/AccidentNotificationTemplate'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields')

export * from './types'

export default AccidentNotificationTemplate
