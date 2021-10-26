import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { DrivingLicenseService } from '../drivingLicense.service'
export * from '@island.is/nest/audit'
import {
  DrivingLicense,
  HasTeachingRights,
  StudentInformationResult,
  ApplicationEligibility,
  Juristiction,
  QualityPhoto,
  StudentAssessment,
  ApplicationEligibilityInput,
  Teacher,
} from './models'
import { AuditService } from '@island.is/nest/audit'

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

  @Query(() => [Teacher])
  drivingLicenseTeachers() {
    return this.drivingLicenseService.getTeachers()
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
    @Args('input') input: ApplicationEligibilityInput,
  ) {
    return this.drivingLicenseService.getApplicationEligibility(
      user.nationalId,
      input.applicationFor,
    )
  }

  @Query(() => [Juristiction])
  drivingLicenseListOfJuristictions() {
    return this.drivingLicenseService.getListOfJuristictions()
  }

  @Query(() => QualityPhoto)
  qualityPhoto(@CurrentUser() user: User) {
    return this.drivingLicenseService.getQualityPhoto(user.nationalId)
  }

  @Query(() => StudentAssessment)
  drivingLicenseStudentAssessment(@CurrentUser() user: User) {
    return this.drivingLicenseService.getDrivingAssessment(user.nationalId)
  }
}
