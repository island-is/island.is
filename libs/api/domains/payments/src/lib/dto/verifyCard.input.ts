import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('PaymentsVerifyCardBrowserInfoInput')
export class VerifyCardBrowserInfoInput {
  @Field(() => Int, {
    description: 'Total height of the payer screen in pixels',
  })
  screenHeight!: number

  @Field(() => Int, {
    description: 'Total width of the payer screen in pixels',
  })
  screenWidth!: number

  @Field(() => Int, {
    nullable: true,
    description: 'Colour depth of the payer screen in bits per pixel',
  })
  colorDepth?: number

  @Field(() => Int, {
    nullable: true,
    description:
      'Offset in minutes between UTC and the payer browser local time',
  })
  timeZoneOffset?: number

  @Field(() => String, {
    nullable: true,
    description: 'Browser language tag, e.g. is or en-GB',
  })
  language?: string

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether the payer browser is able to execute Java',
  })
  javaEnabled?: boolean
}

@InputType('PaymentsVerifyCardInput')
export class VerifyCardInput {
  @Field((_) => String)
  cardNumber!: string

  @Field((_) => Number)
  expiryMonth!: number

  @Field((_) => Number)
  expiryYear!: number

  @Field((_) => String)
  paymentFlowId!: string

  @Field(() => String, {
    nullable: true,
    description:
      'Cardholder name as printed on the card, used for 3-D Secure authentication',
  })
  cardholderName?: string

  @Field(() => VerifyCardBrowserInfoInput, {
    nullable: true,
    description:
      'Browser environment of the payer, used for 3-D Secure authentication',
  })
  browserInfo?: VerifyCardBrowserInfoInput
}
