import { UseGuards } from '@nestjs/common'
import { ID, Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { IdsUserGuard } from '@island.is/auth-nest-tools'

import { TenantEnvironment } from './models/tenant-environment.model'
import type { TenantEnvironmentId } from './models/tenant-environment.model'

@UseGuards(IdsUserGuard)
@Resolver(() => TenantEnvironment)
export class TenantEnvironmentResolver {
  @ResolveField('id', () => ID)
  resolveId(@Parent() tenant: TenantEnvironment): TenantEnvironmentId {
    return `${tenant.name}#${tenant.environment}`
  }
}
