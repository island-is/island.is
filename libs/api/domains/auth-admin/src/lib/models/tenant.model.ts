import { Field, ObjectType } from '@nestjs/graphql'

import { TenantEnvironment } from './tenant-environment.model'

@ObjectType('AuthAdminTenant')
export class Tenant {
  @Field()
  id!: string

  @Field(() => [TenantEnvironment])
  environments!: TenantEnvironment[]
}
