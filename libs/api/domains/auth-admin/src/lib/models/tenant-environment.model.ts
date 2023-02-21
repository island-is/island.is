import { Field, Int, ObjectType } from '@nestjs/graphql'

import { Environment } from './environment'
import { TranslatedValue } from './translated-value.model'

@ObjectType('AuthAdminTenantEnvironment')
export class TenantEnvironment {
  @Field()
  id!: string

  @Field(() => Environment)
  environment!: Environment

  @Field(() => [TranslatedValue])
  displayName!: TranslatedValue[]

  @Field(() => Int)
  applicationsCount!: number

  @Field(() => Int)
  apisCount!: number
}
