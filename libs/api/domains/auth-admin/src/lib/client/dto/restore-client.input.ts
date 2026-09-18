import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType('AuthAdminRestoreClientInput')
export class RestoreClientInput {
  @Field(() => String)
  tenantId!: string

  @Field(() => String)
  clientId!: string

  @Field(() => [Environment], {
    nullable: true,
    description: 'Environments to restore in. Defaults to all environments.',
  })
  environments?: Environment[]
}
