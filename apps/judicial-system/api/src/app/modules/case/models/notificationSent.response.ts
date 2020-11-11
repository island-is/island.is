import { Field, ObjectType } from '@nestjs/graphql'

import { SendNotificationResponse as TSendNotificationResponse } from '@island.is/judicial-system/types'

@ObjectType()
export class SendNotificationResponse implements TSendNotificationResponse {
  @Field()
  notificationSent: boolean
}
