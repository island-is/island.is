import { Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { NotificationsService } from '../../../../notification/notifications.service'
import { CreateNotificationResponse } from '@island.is/clients/user-notification'
import { TemplateApiModuleActionProps } from '../../../../types'
import { SendNotificationParameters } from '@island.is/application/types'
import { TemplateApiError } from '@island.is/nest/problem'

@Injectable()
export class UserNotificationService extends BaseTemplateApiService {
  constructor(private readonly notificationsService: NotificationsService) {
    super('UserNotification')
  }

  public async sendNotification({
    application,
    auth,
    params,
  }: TemplateApiModuleActionProps<SendNotificationParameters>): Promise<CreateNotificationResponse> {
    if (!params) {
      throw new TemplateApiError(
        {
          title: 'No parameters provided',
          summary: 'No parameters provided for sendNotification',
        },
        400,
      )
    }
    return this.notificationsService.sendNotification({
      type: params.type,
      messageParties: {
        recipient: auth.nationalId,
      },
      applicationId: application.id,
      args: params.args,
    })
  }
}
