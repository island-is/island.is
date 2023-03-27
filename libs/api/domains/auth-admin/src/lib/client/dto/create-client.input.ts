import { Field, InputType, ID } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

import { ClientType } from '../../models/client-type.enum'

@InputType('CreateAuthAdminClientInput')
export class CreateClientInput {
  @Field(() => ID, { nullable: false })
  clientId!: string

  @Field(() => ClientType, { nullable: false })
  clientType!: ClientType

  @Field(() => [Environment], { nullable: false })
  environments!: Environment[]

  @Field(() => String, { nullable: false })
  displayName!: string

  @Field(() => ID, { nullable: false })
  tenantId!: string
}
