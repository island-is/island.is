import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('PaymentsCardVerificationField')
class VerificationField {
  @Field(() => String, { description: 'Field name' })
  name!: string

  @Field(() => String, { description: 'Field value' })
  value!: string
}

@ObjectType('PaymentsCardInformation')
class CardInformation {
  @Field(() => String, {
    description: 'Card scheme (for example Visa or MasterCard)',
  })
  cardScheme!: string

  @Field(() => String, {
    description: 'Issuing country of the card',
    nullable: true,
  })
  issuingCountry?: string | null = null

  @Field(() => String, {
    description: 'Card usage description',
  })
  cardUsage!: string

  @Field(() => String, { description: 'Card category', nullable: true })
  cardCategory?: string | null = null

  @Field(() => Boolean, {
    description: 'Out-of-SCA scope status',
    nullable: true,
  })
  outOfScaScope?: boolean | null = null
}

@ObjectType('PaymentsVerifyCardResponse')
export class VerifyCardResponse {
  @Field(() => String, { description: 'Raw response from card verification' })
  cardVerificationRawResponse!: string

  @Field(() => String, { description: 'Post URL for verification' })
  postUrl!: string

  @Field(() => [VerificationField], { description: 'Verification fields' })
  verificationFields!: VerificationField[]

  @Field(() => [VerificationField], { description: 'Additional fields' })
  additionalFields!: VerificationField[]

  @Field(() => Boolean, {
    description: 'Indicates if the verification was successful',
  })
  isSuccess!: boolean

  @Field(() => CardInformation, { description: 'Card information' })
  cardInformation!: CardInformation

  @Field(() => String, {
    description:
      'Gateway script that must be loaded, unchanged, to run the custom 3DS form',
    nullable: true,
  })
  scriptPath?: string

  @Field(() => String, {
    description: 'URL the 3DS Method fields are posted to (hidden iframe)',
    nullable: true,
  })
  tdsMethodPostUrl?: string

  @Field(() => [VerificationField], {
    description: '3DS Method fields, present when the issuer requires it',
    nullable: true,
  })
  tdsMethodFields?: VerificationField[]

  @Field(() => String, {
    description: '3DS flow type: Challenge, Frictionless or Method',
    nullable: true,
  })
  authenticationType?: string

  @Field(() => String, { description: 'Response code from the verification' })
  responseCode!: string

  @Field(() => String, { description: 'Response time of the verification' })
  responseTime!: string
}
