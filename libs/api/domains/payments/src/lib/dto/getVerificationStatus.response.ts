import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('PaymentsGetVerificationStatus')
export class GetPaymentVerificationStatusResponse {
  @Field(() => Boolean)
  isVerified!: boolean
}
