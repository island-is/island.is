import { Parent, ResolveField, Resolver } from '@nestjs/graphql'

import {
  Address,
  formatAddress,
} from '@island.is/api/domains/national-registry'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import { CurrentUser } from '@island.is/auth-nest-tools'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { AuditService } from '@island.is/nest/audit'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'

import { MostFlownRoute } from '../models/mostFlownRoute.model'
import { User } from '../models/user.model'
import { UserService } from './user.service'

@CodeOwner(CodeOwners.Hugsmidjan)
@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly nationalRegistryV3ClientService: NationalRegistryV3ClientService,
    private readonly auditService: AuditService,
    private readonly userService: UserService,
  ) {}

  @ResolveField('mostFlownRoute', () => MostFlownRoute, { nullable: true })
  resolveMostFlownRoute(
    @Parent() user: User,
    @CurrentUser() auth: AuthUser,
  ): Promise<MostFlownRoute | null> {
    return this.userService.getMostFlownRoute(auth, user.nationalId)
  }

  @ResolveField('address', () => Address, { nullable: true })
  async resolveAddress(
    @Parent() user: User,
    @CurrentUser() auth: AuthUser,
  ): Promise<Address | null> {
    if (user.nationalId !== auth.nationalId) {
      return null
    }

    this.auditService.audit({
      auth,
      namespace: '@island.is/air-discount-scheme',
      action: 'resolveAddress',
      resources: auth.nationalId,
    })

    const address = await this.nationalRegistryV3ClientService
      .getAddress(auth.nationalId)
      .catch(() => null)

    return formatAddress(address)
  }
}
