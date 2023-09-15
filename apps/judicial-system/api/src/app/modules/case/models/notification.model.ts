import { Field, ID, ObjectType } from '@nestjs/graphql'

import type {
  Notification as TNotification,
  NotificationType,
  Recipient as TRecipient,
} from '@island.is/judicial-system/types'

@ObjectType()
export class Recipient implements TRecipient {
  @Field()
  address?: string

  @Field()
  success!: boolean
}

@ObjectType()
export class Notification implements TNotification {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: string

  @Field()
  readonly caseId!: string

  @Field(() => String)
  readonly type!: NotificationType

  @Field(() => [Recipient])
  readonly recipients!: Recipient[]
}
