import { Field, ID, InputType } from '@nestjs/graphql'

@InputType('AuthDelegationRequestInput')
export class DelegationRequestInput {
  @Field(() => ID)
  requestId!: string
}

@InputType('AuthFulfillDelegationRequestInput')
export class FulfillDelegationRequestInput {
  @Field(() => ID)
  requestId!: string

  @Field(() => ID)
  delegationId!: string
}
