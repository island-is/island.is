import { Field, InputType, registerEnumType } from '@nestjs/graphql'

import { MeDelegationsControllerFindAllV1DirectionEnum } from '@island.is/clients/auth/delegation-api'

registerEnumType(MeDelegationsControllerFindAllV1DirectionEnum, {
  name: 'AuthDelegationDirection',
})

@InputType('AuthDelegationsInput')
export class DelegationsInput {
  @Field(() => String, { nullable: true })
  domain?: string | null

  @Field(() => MeDelegationsControllerFindAllV1DirectionEnum, {
    nullable: true,
  })
  direction?: MeDelegationsControllerFindAllV1DirectionEnum
}
