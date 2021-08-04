import AccidentNotificationTemplate from './lib/AccidentNotificationTemplate'
import { AccidentNotification } from './lib/dataSchema'
import * as appMessages from './lib/messages'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields')

export * from './types'

export type AccidentNotificationAnswers = AccidentNotification

export const messages = appMessages

export default AccidentNotificationTemplate
