import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('PaymentsValidateApplePayMerchantResponse')
export class ValidateApplePayMerchantResponse {
  @Field(() => String, {
    description: 'Apple Pay merchant session blob from Apple',
  })
  session!: string
}
