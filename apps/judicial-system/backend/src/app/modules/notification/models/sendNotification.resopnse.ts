import { ApiProperty } from '@nestjs/swagger'

import type { SendNotificationResponse as TSendNotificationResponse } from '@island.is/judicial-system/types'

import { Notification } from './notification.model'

export class SendNotificationResponse implements TSendNotificationResponse {
  @ApiProperty()
  notificationSent!: boolean

  @ApiProperty({ type: Notification })
  notification?: Notification
}
