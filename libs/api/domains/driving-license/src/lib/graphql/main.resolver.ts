import {
  Args,
  Query,
  Resolver,
  ResolveField,
  Parent,
  Directive,
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'

import { DrivingLicenseService } from '../drivingLicense.service'
import { DrivingLicense } from './drivingLicense.model'
import { DrivingLicenseType } from './drivingLicenseType.model'
import { PenaltyPointStatus } from './penaltyPointStatus.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly drivingLicenseService: DrivingLicenseService) {}

  @Query(() => DrivingLicense)
  drivingLicense(@CurrentUser() user: User) {
    return this.drivingLicenseService.getDrivingLicense(user.nationalId)
  }

  @Query(() => [DrivingLicenseType])
  drivingLicenseDeprivationTypes() {
    return this.drivingLicenseService.getDeprivationTypes()
  }

  @Query(() => [DrivingLicenseType])
  drivingLicenseEntitlementTypes() {
    return this.drivingLicenseService.getEntitlementTypes()
  }

  @Query(() => [DrivingLicenseType])
  drivingLicenseRemarkTypes() {
    return this.drivingLicenseService.getRemarkTypes()
  }

  @Query(() => PenaltyPointStatus)
  drivingLicensePenaltyPointStatus(@CurrentUser() user: User) {
    return this.drivingLicenseService.getPenaltyPointStatus(user.nationalId)
  }
}
