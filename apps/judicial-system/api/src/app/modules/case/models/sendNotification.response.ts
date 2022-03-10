import { Field, ObjectType } from '@nestjs/graphql'

import type { SendNotificationResponse as TSendNotificationResponse } from '@island.is/judicial-system/types'

@ObjectType()
export class SendNotificationResponse implements TSendNotificationResponse {
  @Field()
  notificationSent!: boolean
}
