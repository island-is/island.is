import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import type { Defendant as TDefendant } from '@island.is/judicial-system/types'
import { Gender } from '@island.is/judicial-system/types'

registerEnumType(Gender, { name: 'Gender' })

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

  @Field(() => Gender, { nullable: true })
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
