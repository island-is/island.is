import { Field, InputType } from '@nestjs/graphql'

@InputType('PaymentsValidateApplePayMerchantInput')
export class ValidateApplePayMerchantInput {
  @Field(() => String, {
    description: 'Apple Pay validation URL from onvalidatemerchant event',
  })
  validationURL!: string
}
