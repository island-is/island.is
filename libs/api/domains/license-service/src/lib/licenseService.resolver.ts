import { Args, Query, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'

import { LicenseServiceService } from './licenseService.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class LicenseServiceResolver {
  constructor(private readonly licenseServiceService: LicenseServiceService) {}

  @Query(() => [])
  allLicenses(@CurrentUser() user: User) {
    return this.licenseServiceService.getAllLicenses(user.nationalId)
  }

}
