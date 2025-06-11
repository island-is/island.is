import { defineTemplateApi } from '../../TemplateApi'
import {
  NotificationType,
  NotificationArgs,
} from '@island.is/application/template-api-modules'

export interface SendNotificationParameters {
  type: NotificationType
  args?: NotificationArgs<NotificationType>
}

export const SendNotificationApi = defineTemplateApi({
  action: 'sendNotification',
  namespace: 'UserNotification',
  externalDataId: 'userNotification',
})
