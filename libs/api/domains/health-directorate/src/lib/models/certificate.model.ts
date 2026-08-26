import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthDirectorateCertificate {
  @Field(() => ID)
  id!: string

  @Field()
  conversationId!: string

  @Field()
  messageId!: string

  @Field()
  conversationTypeCode!: string

  @Field({ nullable: true })
  certificateRequestId?: string

  @Field(() => GraphQLISODateTime)
  issuedAt!: Date

  @Field({
    description:
      'True when the HCP charges patients for this certificate and it is gated behind a successful payment.',
  })
  requiresPayment!: boolean

  @Field()
  paid!: boolean

  @Field(() => Int, {
    nullable: true,
    description:
      'Price the patient would be charged, in ISK. Only set when requiresPayment is true.',
  })
  amountIsk?: number

  @Field({ description: 'URL to download the certificate PDF.' })
  downloadServiceURL!: string
}
