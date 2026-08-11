import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthDirectoratePaymentIntent {
  @Field()
  paymentId!: string

  @Field()
  paymentPageUrl!: string
}
