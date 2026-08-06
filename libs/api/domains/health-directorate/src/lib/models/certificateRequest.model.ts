import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql'
import { CertificateTypeEnum } from './enums'

@ObjectType()
export class HealthDirectorateCertificateRequest {
  @Field(() => ID)
  id!: string

  @Field()
  conversationId!: string

  @Field(() => CertificateTypeEnum)
  certificateType!: CertificateTypeEnum

  @Field({ nullable: true })
  recipientName?: string

  @Field(() => GraphQLISODateTime)
  startDate!: Date

  @Field(() => GraphQLISODateTime)
  endDate!: Date

  @Field({ nullable: true })
  note?: string

  @Field()
  status!: string

  @Field({
    description:
      'True when the request was submitted as an automatic certificate request.',
  })
  isAutomatic!: boolean

  @Field(() => GraphQLISODateTime)
  requestedAt!: Date
}
