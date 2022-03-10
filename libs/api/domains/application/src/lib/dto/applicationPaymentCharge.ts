import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ApplicationPaymentChargeResponse {
  @Field()
  id!: string

  @Field()
  paymentUrl!: string
}
