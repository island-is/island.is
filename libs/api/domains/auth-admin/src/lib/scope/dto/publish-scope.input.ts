import { Environment } from '@island.is/shared/types'
import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthAdminPublishScopeInput')
export class PublishScopeInput {
  @Field(() => Environment)
  targetEnvironment!: Environment

  @Field(() => Environment, { nullable: false })
  sourceEnvironment!: Environment

  @Field(() => String, { nullable: false })
  scopeName!: string

  @Field(() => String, { nullable: false })
  tenantId!: string
}
