import { Field, InputType, registerEnumType } from '@nestjs/graphql'

import { MeDelegationsControllerFindAllDirectionEnum } from '@island.is/clients/auth/delegation-api'

registerEnumType(MeDelegationsControllerFindAllDirectionEnum, {
  name: 'AuthDelegationDirection',
})

@InputType('AuthDelegationsInput')
export class DelegationsInput {
  @Field(() => String, { nullable: true })
  domain?: string | null

  @Field(() => MeDelegationsControllerFindAllDirectionEnum, { nullable: true })
  direction?: MeDelegationsControllerFindAllDirectionEnum
}
