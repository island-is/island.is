import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class IdentityDocumentModel {
  @Field()
  productionRequestID!: string

  @Field()
  number!: string

  @Field()
  type?: string

  @Field()
  verboseType?: string

  @Field()
  subType?: string

  @Field()
  status?: string

  @Field()
  issuingDate?: string

  @Field()
  expirationDate?: string

  @Field()
  displayFirstName?: string

  @Field()
  displayLastName?: string

  @Field()
  mrzFirstName?: string

  @Field()
  mrzLastName?: string

  @Field()
  sex?: string
}
