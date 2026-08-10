import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'
import { PaymentStatusEnum } from './enums'

@ObjectType()
export class HealthDirectoratePayment {
  @Field(() => ID)
  id!: string

  @Field(() => PaymentStatusEnum)
  status!: PaymentStatusEnum

  @Field({
    description:
      'Id of the resource this payment is for, e.g. a certificate id.',
  })
  resourceId!: string

  @Field(() => Int)
  amountIsk!: number

  @Field(() => GraphQLISODateTime, { nullable: true })
  paidAt?: Date
}
