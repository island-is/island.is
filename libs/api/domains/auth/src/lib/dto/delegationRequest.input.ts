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

  /** Id of the delegation created to fulfill the request. */
  @Field(() => ID)
  delegationId!: string
}
