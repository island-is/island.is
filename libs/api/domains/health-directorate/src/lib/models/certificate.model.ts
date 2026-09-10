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

  @Field()
  requiresPayment!: boolean

  @Field()
  paid!: boolean

  @Field(() => Int, { nullable: true })
  amountIsk?: number
}
