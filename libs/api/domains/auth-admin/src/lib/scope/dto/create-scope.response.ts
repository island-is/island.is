import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@ObjectType('AuthAdminCreateScopeResponse')
export class CreateScopeResponse {
  @Field(() => String, { nullable: false })
  scopeName!: string

  @Field(() => Environment, { nullable: false })
  environment!: Environment
}
