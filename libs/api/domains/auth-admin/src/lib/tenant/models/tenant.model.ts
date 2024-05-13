import { Field, ID, ObjectType } from '@nestjs/graphql'

import { TenantEnvironment } from './tenant-environment.model'

@ObjectType('AuthAdminTenant')
export class Tenant {
  // Setting the id, availableEnvironments and defaultEnvironment
  // as optional in NestJS land but non-null in GQL schema.
  @Field(() => ID)
  id?: string

  @Field(() => [TenantEnvironment])
  environments!: TenantEnvironment[]
}
