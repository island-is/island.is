import { Field, InputType } from '@nestjs/graphql'

@InputType('DeleteAuthDelegationScopesInput')
export class DeleteDelegationScopesInput {
  @Field(() => String)
  delegationId!: string

  @Field(() => [String])
  scopeNames!: string[]
}
