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

  // Admin-only detail fields. Nullable so the existing list query stays
  // backward compatible — they are only populated by the admin details query.
  @Field({ nullable: true })
  nationalId?: string

  @Field({ nullable: true })
  contactEmail?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  organisationLogoKey?: string
}
