import { defineTemplateApi } from '../../TemplateApi'
import {
  NotificationArgs,
  NotificationType,
} from '@island.is/application/types'

export interface SendNotificationParameters {
  type: NotificationType
  args?: NotificationArgs<NotificationType>
}

export const SendNotificationApi = defineTemplateApi({
  action: 'sendNotification',
  namespace: 'UserNotification',
  externalDataId: 'userNotification',
})
