import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { CourtSessionStringType } from '@island.is/judicial-system/types'

registerEnumType(CourtSessionStringType, {
  name: 'CourtSessionStringType',
})

@ObjectType()
export class CourtSessionString {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => String, { nullable: true })
  readonly modified?: string

  @Field(() => ID, { nullable: true })
  readonly caseId?: string

  @Field(() => CourtSessionStringType, { nullable: true })
  readonly stringType?: CourtSessionStringType

  @Field(() => ID, { nullable: true })
  readonly courtSessionId?: string

  @Field(() => ID, { nullable: true })
  readonly mergedCaseId?: string

  @Field(() => String, { nullable: true })
  readonly value?: string
}
