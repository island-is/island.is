import { Field, ID, ObjectType } from '@nestjs/graphql'

import type {
  Defendant as TDefendant,
  Gender,
} from '@island.is/judicial-system/types'

@ObjectType()
export class Defendant implements TDefendant {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: string

  @Field()
  readonly modified!: string

  @Field()
  readonly caseId!: string

  @Field({ nullable: true })
  readonly noNationalId?: boolean

  @Field({ nullable: true })
  readonly nationalId?: string

  @Field({ nullable: true })
  readonly name?: string

  @Field(() => String, { nullable: true })
  readonly gender?: Gender

  @Field({ nullable: true })
  readonly address?: string

  @Field({ nullable: true })
  readonly citizenship?: string

  @Field({ nullable: true })
  readonly defenderName?: string

  @Field({ nullable: true })
  readonly defenderNationalId?: string

  @Field({ nullable: true })
  readonly defenderEmail?: string

  @Field({ nullable: true })
  readonly defenderPhoneNumber?: string

  @Field(() => Boolean)
  readonly defendantWaivesRightToCounsel!: boolean
}
