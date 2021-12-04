import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthDelegationInput')
export class DelegationInput {
  @Field(() => String)
  delegationId!: string
}
