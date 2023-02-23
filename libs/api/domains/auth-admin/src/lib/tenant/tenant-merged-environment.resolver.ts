import { UseGuards } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { IdsUserGuard } from '@island.is/auth-nest-tools'

import { TenantMergedEnvironment } from './models/tenant-merged-environment.model'

@UseGuards(IdsUserGuard)
@Resolver(() => TenantMergedEnvironment)
export class TenantMergedEnvironmentResolver {
  @ResolveField('id', () => String)
  resolveId(@Parent() tenant: TenantMergedEnvironment) {
    return `${tenant.name}-merged`
  }
}
