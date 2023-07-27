import { Field, InputType } from '@nestjs/graphql'

import { Environment } from 'environment'

@InputType('AuthAdminRevokeSecretsInput')
export class RevokeSecretsInput {
  @Field(() => String, { nullable: false })
  tenantId!: string

  @Field(() => String, { nullable: false })
  clientId!: string

  @Field(() => Environment, { nullable: false })
  environment!: Environment
}
