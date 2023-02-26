import { Field, ObjectType } from '@nestjs/graphql'
import { Environment } from '../../models/environment'

import { TenantEnvironment } from './tenant-environment.model'

@ObjectType('AuthAdminTenant')
export class Tenant {
  @Field()
  id!: string

  @Field(() => [TenantEnvironment])
  environments!: TenantEnvironment[]

  @Field(() => [Environment])
  availableEnvironments!: Environment[]

  @Field(() => TenantEnvironment)
  defaultEnvironment!: TenantEnvironment
}
