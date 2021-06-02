import { Args, Query, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'

import { LicenseServiceService } from '../licenseService.service'
import { GenericLicense } from './genericLicense.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly licenseServiceService: LicenseServiceService) {}

  @Query(() => [GenericLicense])
  genericLicenses(@CurrentUser() user: User) {
    console.log('genericLicenses !!!!!!')

    return this.licenseServiceService.getAllLicenses(user.nationalId)
  }
}
