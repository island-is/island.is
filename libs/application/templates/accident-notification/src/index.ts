import AccidentNotificationTemplate from './lib/AccidentNotificationTemplate'
import { AccidentNotification } from './lib/dataSchema'
import * as appMessages from './lib/messages'
import { OnBehalf } from './utils/enums'

import * as appUtils from './utils/miscUtils'

export const getFields = () => import('./fields')

export * from './utils/types'
export * from './shared'
export { OnBehalf }

export type AccidentNotificationAnswers = AccidentNotification

export const messages = appMessages
export const utils = appUtils

export default AccidentNotificationTemplate
