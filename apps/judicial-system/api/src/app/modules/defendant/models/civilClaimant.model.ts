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
  readonly caseId!: string

  @Field(() => Boolean, { nullable: true })
  readonly noNationalId?: boolean

  @Field(() => String, { nullable: true })
  readonly name?: string

  @Field(() => String, { nullable: true })
  readonly nationalId?: string

  @Field(() => Boolean, { nullable: true })
  readonly hasSpokesperson?: boolean

  @Field(() => Boolean, { nullable: true })
  readonly spokespersonIsLawyer?: boolean

  @Field(() => String, { nullable: true })
  readonly spokespersonNationalId?: string

  @Field(() => String, { nullable: true })
  readonly spokespersonName?: string

  @Field(() => String, { nullable: true })
  readonly spokespersonEmail?: string

  @Field(() => String, { nullable: true })
  readonly spokespersonPhoneNumber?: string

  @Field(() => Boolean, { nullable: true })
  readonly caseFilesSharedWithSpokesperson?: boolean
}
