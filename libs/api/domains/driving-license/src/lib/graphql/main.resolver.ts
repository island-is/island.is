import { Args, Query, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { DrivingLicenseService } from '../drivingLicense.service'
import { DrivingLicense } from './drivingLicense.model'
import { DrivingLicenseType } from './drivingLicenseType.model'
import { PenaltyPointStatus } from './penaltyPointStatus.model'
import { HasTeachingRights } from './hasTeachingRights.model'
import { StudentInformationResult } from './studentInformationResult.model'
import { ApplicationEligibility } from './applicationEligibility.model'
import { Juristiction } from './juristiction.model'

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

  @Query(() => HasTeachingRights)
  drivingLicenseTeachingRights(@CurrentUser() user: User) {
    return this.drivingLicenseService.getTeachingRights(user.nationalId)
  }

  @Query(() => StudentInformationResult)
  drivingLicenseStudentInformation(@Args('nationalId') nationalId: string) {
    const student = this.drivingLicenseService.getStudentInformation(nationalId)

    return {
      student,
    }
  }

  @Query(() => ApplicationEligibility)
  drivingLicenseApplicationEligibility(
    @CurrentUser() user: User,
    @Args('type') type: string,
  ) {
    return this.drivingLicenseService.getApplicationEligibility(
      user.nationalId,
      type,
    )
  }

  @Query(() => [Juristiction])
  drivingLicenseListOfJuristictions() {
    return this.drivingLicenseService.getListOfJuristictions()
  }
}
