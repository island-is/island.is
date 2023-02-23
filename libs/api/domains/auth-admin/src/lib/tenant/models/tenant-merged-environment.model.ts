import { Field, Int, ObjectType } from '@nestjs/graphql'

import { Environment } from '../../models/environment'
import { TranslatedValue } from '../../models/translated-value.model'

@ObjectType('AuthAdminTenantMergedEnvironment')
export class TenantMergedEnvironment {
  @Field()
  id!: string

  @Field(() => [Environment])
  environment!: Environment[]

  @Field(() => String)
  name!: string

  @Field(() => [TranslatedValue])
  displayName!: TranslatedValue[]

  @Field(() => Int)
  applicationCount!: number

  @Field(() => Int)
  apiCount!: number
}
