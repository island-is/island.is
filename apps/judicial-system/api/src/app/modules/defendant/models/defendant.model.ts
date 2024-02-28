import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { DefendantPlea, Gender } from '@island.is/judicial-system/types'

registerEnumType(Gender, { name: 'Gender' })
registerEnumType(DefendantPlea, { name: 'DefendantPlea' })

@ObjectType()
export class Defendant {
  @Field(() => ID)
  readonly id!: string

  @Field({ nullable: true })
  readonly created?: string

  @Field({ nullable: true })
  readonly modified?: string

  @Field({ nullable: true })
  readonly caseId?: string

  @Field(() => Boolean, { nullable: true })
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

  @Field(() => Boolean, { nullable: true })
  readonly defendantWaivesRightToCounsel?: boolean

  @Field(() => DefendantPlea, { nullable: true })
  readonly defendantPlea?: DefendantPlea
}
