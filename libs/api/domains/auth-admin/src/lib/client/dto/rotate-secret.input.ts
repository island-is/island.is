import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType('AuthAdminRotateSecretInput')
export class RotateSecretInput {
  @Field(() => String, { nullable: false })
  tenantId!: string

  @Field(() => String, { nullable: false })
  clientId!: string

  @Field(() => Environment, { nullable: false })
  environment!: Environment

  @Field(() => Boolean, { nullable: true })
  revokeOldSecrets?: boolean
}
