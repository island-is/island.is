import { Field, InputType } from '@nestjs/graphql'

@InputType('DeleteAuthDelegationInput')
export class DeleteDelegationInput {
  @Field(() => String)
  delegationId!: string
}
