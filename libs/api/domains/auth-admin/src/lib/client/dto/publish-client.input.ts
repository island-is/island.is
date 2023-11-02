import { Environment } from '@island.is/shared/types'
import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthAdminPublishClientInput')
export class PublishClientInput {
  @Field(() => Environment, { nullable: false })
  targetEnvironment!: Environment

  @Field(() => Environment, { nullable: false })
  sourceEnvironment!: Environment

  @Field(() => String, { nullable: false })
  clientId!: string

  @Field(() => String, { nullable: false })
  tenantId!: string
}
