import { DelegationType } from '@island.is/clients/auth-public-api'
import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthActorDelegationInput')
export class ActorDelegationInput {
  @Field(() => [DelegationType], { nullable: true })
  delegationTypes?: DelegationType[]
}
