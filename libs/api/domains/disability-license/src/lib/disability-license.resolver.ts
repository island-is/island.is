import { Args, Directive, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Scope, UseGuards } from '@nestjs/common'

import {
  AuthMiddleware,
  BypassAuth,
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { DisabilityLicenseService } from '@island.is/clients/disability-license'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class DisabilityLicenseResolver {
  constructor(private disabilityLicenseApi: DisabilityLicenseService) {}

  @Query(() => Boolean)
  hasDisabilityLicense(@CurrentUser() user: User): Promise<Boolean> {
    return this.disabilityLicenseApi.hasDisabilityLicense(user)
  }
}
