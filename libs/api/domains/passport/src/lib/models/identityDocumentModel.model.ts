import { Field, ObjectType } from '@nestjs/graphql'

type Gender = 'F' | 'M' | 'X'

@ObjectType()
export class IdentityDocumentModel {
  @Field(() => String)
  number!: string

  @Field(() => String)
  type!: string

  @Field(() => String)
  verboseType!: string

  @Field(() => String)
  subType!: string

  @Field(() => String)
  status!: string

  @Field(() => Date)
  issuingDate!: Date

  @Field(() => Date)
  expirationDate!: Date

  @Field(() => String)
  displayFirstName?: string

  @Field(() => String)
  displayLastName?: string

  @Field(() => String)
  mrzFirstName?: string

  @Field(() => String)
  mrzLastName?: string

  @Field()
  sex?: Gender

  @Field(() => String, { nullable: true })
  numberWithType?: string

  @Field(() => String, { nullable: true })
  expiryStatus?: string

  @Field(() => Boolean, { nullable: true })
  expiresWithinNoticeTime?: boolean
}
