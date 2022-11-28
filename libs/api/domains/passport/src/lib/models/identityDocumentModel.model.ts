import { Field, ObjectType } from '@nestjs/graphql'

export type Gender = 'F' | 'M' | 'X'

@ObjectType()
export class IdentityDocumentModel {
  @Field(() => String, { nullable: true })
  number?: string | null

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => String, { nullable: true })
  verboseType?: string | null

  @Field(() => String, { nullable: true })
  subType?: string | null

  @Field(() => String, { nullable: true })
  status?: string | null

  @Field(() => Date, { nullable: true })
  issuingDate?: Date | null

  @Field(() => Date, { nullable: true })
  expirationDate?: Date | null

  @Field(() => String, { nullable: true })
  displayFirstName?: string | null

  @Field(() => String, { nullable: true })
  displayLastName?: string | null

  @Field(() => String, { nullable: true })
  mrzFirstName?: string | null

  @Field(() => String, { nullable: true })
  mrzLastName?: string | null

  @Field(() => String, { nullable: true })
  sex?: Gender | null

  @Field(() => String, { nullable: true })
  numberWithType?: string

  @Field(() => String, { nullable: true })
  expiryStatus?: string

  @Field(() => Boolean, { nullable: true })
  expiresWithinNoticeTime?: boolean
}
