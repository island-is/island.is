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
import { AuditService } from '@island.is/nest/audit'
import { StudentInformation } from '../drivingLicense.type'

const namespace = '@island.is/api/driving-license'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(
    private readonly drivingLicenseService: DrivingLicenseService,
    private readonly auditService: AuditService,
  ) {}

  @Query(() => DrivingLicense)
  drivingLicense(@CurrentUser() user: User) {
    return this.auditService.auditPromise(
      {
        user,
        namespace,
        action: 'drivingLicense',
        resources: user.nationalId,
      },
      this.drivingLicenseService.getDrivingLicense(user.nationalId),
    )
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
    return this.auditService.auditPromise(
      {
        user,
        namespace,
        action: 'drivingLicensePenaltyPointStatus',
        resources: user.nationalId,
      },
      this.drivingLicenseService.getPenaltyPointStatus(user.nationalId),
    )
  }

  @Query(() => HasTeachingRights)
  drivingLicenseTeachingRights(@CurrentUser() user: User) {
    return this.auditService.auditPromise(
      {
        user,
        namespace,
        action: 'drivingLicenseTeachingRights',
        resources: user.nationalId,
      },
      this.drivingLicenseService.getTeachingRights(user.nationalId),
    )
  }

  @Query(() => StudentInformationResult)
  async drivingLicenseStudentInformation(
    @Args('nationalId') nationalId: string,
    @CurrentUser() user: User,
  ) {
    const student = await this.drivingLicenseService.getStudentInformation(
      nationalId,
    )

    this.auditService.audit({
      user,
      namespace,
      action: 'drivingLicenseStudentInformation',
      resources: nationalId,
    })

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
