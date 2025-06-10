import { defineTemplateApi } from '../../TemplateApi'

export const SendNotificationApi = defineTemplateApi({
  action: 'sendNotification',
  namespace: 'UserNotification',
  externalDataId: 'userNotification',
})
