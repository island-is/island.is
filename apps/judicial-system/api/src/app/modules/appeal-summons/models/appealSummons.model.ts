import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { AppealSummonsAppellantSide } from '@island.is/judicial-system/types'

registerEnumType(AppealSummonsAppellantSide, {
  name: 'AppealSummonsAppellantSide',
})

@ObjectType()
export class AppealSummonsDefendant {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => String, { nullable: true })
  readonly modified?: string

  @Field(() => String)
  readonly defendantId!: string

  @Field(() => AppealSummonsAppellantSide)
  readonly appellantSide!: AppealSummonsAppellantSide

  @Field(() => String)
  readonly claims!: string
}

@ObjectType()
export class AppealSummons {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => String, { nullable: true })
  readonly modified?: string

  @Field(() => String, { nullable: true })
  readonly caseId?: string

  @Field(() => String, { nullable: true })
  readonly appealCaseId?: string

  @Field(() => String, { nullable: true })
  readonly confirmedDate?: string

  @Field(() => String, { nullable: true })
  readonly sentToCourtOfAppealsDate?: string

  @Field(() => [AppealSummonsDefendant], { nullable: true })
  readonly defendants?: AppealSummonsDefendant[]
}
