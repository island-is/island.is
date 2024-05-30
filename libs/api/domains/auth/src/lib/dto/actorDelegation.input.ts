import { AuthDelegationType } from '@island.is/clients/auth/delegation-api'
import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthActorDelegationInput')
export class ActorDelegationInput {
  @Field(() => [AuthDelegationType], { nullable: true })
  delegationTypes?: AuthDelegationType[]
}
