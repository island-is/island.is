import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('PaymentsGetVerificationStatus')
export class GetPaymentVerificationStatusResponse {
  @Field(() => Boolean)
  isVerified!: boolean

  @Field(() => Boolean, {
    nullable: true,
    description:
      'True when the 3DS verification for the current attempt failed',
  })
  isFailed?: boolean
}
