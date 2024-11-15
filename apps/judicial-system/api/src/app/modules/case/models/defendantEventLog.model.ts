import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { DefendantEventType } from '@island.is/judicial-system/types'

registerEnumType(DefendantEventType, { name: 'DefendantEventType' })
@ObjectType()
export class DefendantEventLog {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: false })
  readonly created!: string

  @Field(() => ID, { nullable: false })
  readonly caseId!: string

  @Field(() => ID, { nullable: false })
  readonly defendantId!: string

  @Field(() => DefendantEventType, { nullable: false })
  readonly eventType!: DefendantEventType
}
