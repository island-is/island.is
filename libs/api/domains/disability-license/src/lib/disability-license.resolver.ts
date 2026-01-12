import { Query, Resolver } from '@nestjs/graphql'

import { UseGuards } from '@nestjs/common'

import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { DisabilityLicenseService } from '@island.is/clients/disability-license'
import { ApiScope } from '@island.is/auth/scopes'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class DisabilityLicenseResolver {
  constructor(private disabilityLicenseApi: DisabilityLicenseService) {}

  @Query(() => Boolean)
  hasDisabilityLicense(@CurrentUser() user: User): Promise<boolean> {
    return this.disabilityLicenseApi.hasDisabilityLicense(user)
  }
}
