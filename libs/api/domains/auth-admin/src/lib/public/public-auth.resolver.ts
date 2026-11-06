import { Args, Query, Resolver } from '@nestjs/graphql'

import { PublicAuthScope, PublicAuthTenant } from './public-auth.models'
import { PublicAuthService } from './public-auth.service'

@Resolver()
export class PublicAuthResolver {
  constructor(private readonly publicAuthService: PublicAuthService) {}

  @Query(() => [PublicAuthTenant], { name: 'publicAuthTenants' })
  getTenants(): Promise<PublicAuthTenant[]> {
    return this.publicAuthService.getTenants()
  }

  @Query(() => [PublicAuthScope], { name: 'publicAuthTenantScopes' })
  getScopes(@Args('tenantId') tenantId: string): Promise<PublicAuthScope[]> {
    return this.publicAuthService.getScopes(tenantId)
  }
}
