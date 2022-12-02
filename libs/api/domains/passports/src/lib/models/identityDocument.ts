import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class IdentityDocument {
  @Field({ nullable: true })
  productionRequestID?: string

  @Field({ nullable: true })
  number?: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  verboseType?: string

  @Field({ nullable: true })
  subType?: string

  @Field({ nullable: true })
  status?: string

  @Field(() => Date, { nullable: true })
  issuingDate?: Date

  @Field(() => Date, { nullable: true })
  expirationDate?: Date

  @Field({ nullable: true })
  displayFirstName?: string

  @Field({ nullable: true })
  displayLastName?: string

  @Field({ nullable: true })
  mrzFirstName?: string

  @Field({ nullable: true })
  mrzLastName?: string

  @Field({ nullable: true })
  sex?: string
}
