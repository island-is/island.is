import { Field, ObjectType } from '@nestjs/graphql'

import { TenantEnvironment } from './tenant-environment.model'
import { TenantMergedEnvironment } from './tenant-merged-environment.model'

@ObjectType('AuthAdminTenant')
export class Tenant {
  @Field()
  id!: string

  @Field(() => [TenantEnvironment])
  environments!: TenantEnvironment[]

  @Field(() => TenantMergedEnvironment)
  mergedEnvironment!: TenantMergedEnvironment
}
