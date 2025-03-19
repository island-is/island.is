import template from './lib/WorkAccidentNotificationTemplate'
import { WorkAccidentNotificationAnswers } from './lib/dataSchema'

export const getFields = () => import('./fields')

export type WorkAccidentNotification = WorkAccidentNotificationAnswers
export default template
