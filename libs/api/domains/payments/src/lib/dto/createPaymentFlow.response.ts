import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class PaymentUrls {
  @Field(() => String, {
    nullable: true,
    description: 'URL for Icelandic locale',
  })
  is?: string

  @Field(() => String, {
    nullable: true,
    description: 'URL for English locale',
  })
  en?: string
}

@ObjectType()
export class CreatePaymentFlowResponse {
  @Field(() => PaymentUrls, {
    description: 'Localized URLs for payment flow',
  })
  urls!: PaymentUrls
}
