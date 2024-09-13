import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CivilClaimant {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => String, { nullable: true })
  readonly modified?: string

  @Field(() => ID, { nullable: true })
  readonly caseId?: string

  @Field(() => ID, { nullable: true })
  readonly defendantId?: string

  @Field(() => String, { nullable: true })
  readonly name?: string

  @Field(() => String, { nullable: true })
  readonly nationalId?: string

  @Field(() => String, { nullable: true })
  readonly defenderName?: string

  @Field(() => String, { nullable: true })
  readonly defenderEmail?: string

  @Field(() => String, { nullable: true })
  readonly defenderPhoneNumber?: string

  @Field(() => Boolean, { nullable: true })
  readonly caseFilesSharedWithDefender?: boolean
}
