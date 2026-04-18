import { UseGuards } from '@nestjs/common'
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import { Environment } from '@island.is/shared/types'

import { CreateTenantInput } from './dto/create-tenant.input'
import { CreateTenantResponse } from './dto/create-tenant.response'
import { DeleteTenantInput } from './dto/delete-tenant.input'
import { PublishTenantInput } from './dto/publish-tenant.input'
import { TenantsPayload } from './dto/tenants.payload'
import { UpdateTenantInput } from './dto/update-tenant.input'
import { Tenant } from './models/tenant.model'
import { TenantEnvironment } from './models/tenant-environment.model'
import { TenantsService } from './tenants.service'

@UseGuards(IdsUserGuard)
@Resolver(() => Tenant)
export class TenantResolver {
  constructor(private readonly tenantsService: TenantsService) {}

  @Query(() => Tenant, { name: 'authAdminTenant' })
  getTenant(@Args('id') id: string, @CurrentUser() user: User) {
    return this.tenantsService.getTenantById(id, user)
  }

  @Query(() => TenantsPayload, { name: 'authAdminTenants' })
  getTenants(@CurrentUser() user: User) {
    return this.tenantsService.getTenants(user)
  }

  @Query(() => Tenant, { name: 'authAdminTenantDetails' })
  getTenantDetails(@Args('id') id: string, @CurrentUser() user: User) {
    return this.tenantsService.getTenantByIdForAdmin(id, user)
  }

  @Mutation(() => [CreateTenantResponse], { name: 'createAuthAdminTenant' })
  createTenant(
    @CurrentUser() user: User,
    @Args('input', { type: () => CreateTenantInput })
    input: CreateTenantInput,
  ) {
    return this.tenantsService.createTenant(user, input)
  }

  @Mutation(() => [TenantEnvironment], { name: 'updateAuthAdminTenant' })
  updateTenant(
    @CurrentUser() user: User,
    @Args('input', { type: () => UpdateTenantInput })
    input: UpdateTenantInput,
  ) {
    return this.tenantsService.updateTenant(user, input)
  }

  @Mutation(() => TenantEnvironment, { name: 'publishAuthAdminTenant' })
  publishTenant(
    @CurrentUser() user: User,
    @Args('input', { type: () => PublishTenantInput })
    input: PublishTenantInput,
  ) {
    return this.tenantsService.publishTenant(user, input)
  }

  @Mutation(() => Boolean, { name: 'deleteAuthAdminTenant' })
  deleteTenant(
    @CurrentUser() user: User,
    @Args('input', { type: () => DeleteTenantInput })
    input: DeleteTenantInput,
  ): Promise<boolean> {
    return this.tenantsService.deleteTenant(user, input)
  }

  @ResolveField('defaultEnvironment', () => TenantEnvironment)
  resolveDefaultEnvironment(@Parent() tenant: Tenant): TenantEnvironment {
    if (tenant.environments.length === 0) {
      throw new Error(`Tenant ${tenant.id} has no environments`)
    }

    // Depends on the priority order being decided by the backend
    return tenant.environments[0]
  }

  @ResolveField('availableEnvironments', () => [Environment])
  resolveAvailableEnvironments(@Parent() tenant: Tenant): Environment[] {
    return tenant.environments.map((env) => env.environment)
  }
}
