import { Environment } from '@island.is/shared/types'
import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthAdminScopesInput')
export class ScopesInput {
  @Field(() => String, { nullable: false })
  tenantId!: string

  @Field(() => Environment, { nullable: false })
  environment!: Environment
}
