import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { AppealCourtSessionType } from '@island.is/judicial-system/types'

registerEnumType(AppealCourtSessionType, { name: 'AppealCourtSessionType' })

// A session the court of appeals has called in a verdict appeal.
@ObjectType()
export class AppealCourtSession {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => AppealCourtSessionType, { nullable: true })
  readonly sessionType?: AppealCourtSessionType

  @Field(() => String, { nullable: true })
  readonly sessionDate?: string

  @Field(() => String, { nullable: true })
  readonly courtRoom?: string
}
