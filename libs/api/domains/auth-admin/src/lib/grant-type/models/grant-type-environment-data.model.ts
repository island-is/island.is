import { Field, ObjectType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@ObjectType('AuthAdminGrantTypeEnvironmentData')
export class GrantTypeEnvironmentData {
  @Field(() => Environment)
  environment!: Environment

  @Field(() => String)
  name!: string

  @Field(() => String)
  description!: string

  @Field(() => Date, { nullable: true })
  archived?: Date
}
