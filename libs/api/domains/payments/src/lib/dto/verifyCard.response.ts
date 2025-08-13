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

  @Field(() => String, { description: 'Issuing country of the card' })
  issuingCountry!: string

  @Field(() => String, { description: 'Card usage description' })
  cardUsage!: string

  @Field(() => String, { description: 'Card category' })
  cardCategory!: string

  @Field(() => String, { description: 'Out-of-SCA scope status' })
  outOfScaScope!: string

  @Field(() => String, { description: 'Card product category' })
  cardProductCategory!: string
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

  @Field(() => String, { description: 'Script path for further actions' })
  scriptPath!: string

  @Field(() => String, { description: 'Response code from the verification' })
  responseCode!: string

  @Field(() => String, { description: 'Description of the response' })
  responseDescription!: string

  @Field(() => String, { description: 'Response time of the verification' })
  responseTime!: string
}
