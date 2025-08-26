import { Field, InputType } from '@nestjs/graphql'
import { IsJWT, IsNotEmpty } from 'class-validator'

@InputType('PaymentsCardVerificationCallbackInput')
export class CardVerificationCallbackInput {
  @Field(() => String, {
    description: 'Signed JWT token containing the verification result',
  })
  @IsNotEmpty()
  @IsJWT()
  verificationToken!: string
}
