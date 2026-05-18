import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType('AuthAdminPublishTenantInput')
export class PublishTenantInput {
  @Field(() => String, { nullable: false })
  tenantId!: string

  @Field(() => Environment, { nullable: false })
  sourceEnvironment!: Environment

  @Field(() => Environment, { nullable: false })
  targetEnvironment!: Environment
}
