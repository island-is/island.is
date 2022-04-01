import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { DrivingLicenseService } from '../drivingLicense.service'
export * from '@island.is/nest/audit'
import {
  DrivingLicense,
  HasTeachingRights,
  StudentInformationResult,
  ApplicationEligibility,
  Juristiction,
  StudentAssessment,
  ApplicationEligibilityInput,
  Teacher,
} from './models'
import { AuditService } from '@island.is/nest/audit'

const namespace = '@island.is/api/driving-license'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class MainResolver {
  constructor(
    private readonly drivingLicenseService: DrivingLicenseService,
    private readonly auditService: AuditService,
  ) {}

  @Query(() => DrivingLicense, { nullable: true })
  drivingLicense(@CurrentUser() user: User) {
    return this.auditService.auditPromise(
      {
        auth: user,
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
        auth: user,
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
      auth: user,
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
      user,
      user.nationalId,
      input.applicationFor,
    )
  }

  @Query(() => [Juristiction])
  drivingLicenseListOfJuristictions() {
    return this.drivingLicenseService.getListOfJuristictions()
  }

  @Query(() => StudentAssessment, { nullable: true })
  drivingLicenseStudentAssessment(@CurrentUser() user: User) {
    return this.drivingLicenseService.getDrivingAssessment(user.nationalId)
  }
}
