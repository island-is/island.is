import { ApiProperty } from '@nestjs/swagger'

import type { SendNotificationResponse as TSendNotificationResponse } from '@island.is/judicial-system/types'

export class SendNotificationResponse implements TSendNotificationResponse {
  @ApiProperty()
  notificationSent!: boolean
}
