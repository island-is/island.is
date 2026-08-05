import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@ObjectType('AuthAdminCreateTenantResponse')
export class CreateTenantResponse {
  @Field(() => String, { nullable: false })
  name!: string

  @Field(() => Environment, { nullable: false })
  environment!: Environment
}
