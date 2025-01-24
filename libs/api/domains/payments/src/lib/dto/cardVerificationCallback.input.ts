import { Field, InputType } from '@nestjs/graphql'

@InputType('PaymentsCardVerificationCallbackInput')
export class CardVerificationCallbackInput {
  @Field(() => String, {
    description: 'Signed JWT token containing the verification result',
  })
  verificationToken!: string
}
