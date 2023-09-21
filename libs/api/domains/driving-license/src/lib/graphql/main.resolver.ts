import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import { CACHE_CONTROL_MAX_AGE } from '@island.is/shared/constants'
import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
  BypassAuth,
} from '@island.is/auth-nest-tools'
import { DrivingLicenseService } from '../drivingLicense.service'
export * from '@island.is/nest/audit'
import {
  DrivingLicense,
  HasTeachingRights,
  StudentInformationResult,
  ApplicationEligibility,
  Jurisdiction,
  StudentAssessment,
  ApplicationEligibilityInput,
  Teacher,
  TeacherV4,
} from './models'
import { AuditService } from '@island.is/nest/audit'
import { DrivingInstructorGuard } from './guards/drivingInstructor.guard'
import { StudentCanGetPracticePermitInput } from './models/studentCanGetPracticePermit.input'
import { StudentCanGetPracticePermit } from './models/studentCanGetPracticePermit.model'

const defaultCache: CacheControlOptions = { maxAge: CACHE_CONTROL_MAX_AGE }
const namespace = '@island.is/api/driving-license'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(
    private readonly drivingLicenseService: DrivingLicenseService,
    private readonly auditService: AuditService,
  ) {}

  @Scopes(ApiScope.internal)
  @Query(() => DrivingLicense, { nullable: true })
  drivingLicense(@CurrentUser() user: User) {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'drivingLicense',
        resources: user.nationalId,
      },
      this.drivingLicenseService.getDrivingLicense(user.authorization),
    )
  }

  @Scopes(ApiScope.internal)
  @Query(() => DrivingLicense, { nullable: true })
  legacyDrivingLicense(@CurrentUser() user: User) {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'legacyDrivingLicense',
        resources: user.nationalId,
      },
      this.drivingLicenseService.legacyGetDrivingLicense(user.nationalId),
    )
  }

  @Scopes(ApiScope.internal)
  @Query(() => [Teacher])
  drivingLicenseTeachers() {
    return this.drivingLicenseService.getTeachers()
  }

  @BypassAuth()
  @CacheControl(defaultCache)
  @Query(() => [TeacherV4])
  drivingLicenseTeachersV4() {
    return this.drivingLicenseService.getTeachersV4()
  }

  @Scopes(ApiScope.internal)
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

  @Scopes(ApiScope.internal)
  @UseGuards(DrivingInstructorGuard)
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

  @Scopes(ApiScope.internal)
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

  @Scopes(ApiScope.internal)
  @Query(() => ApplicationEligibility)
  learnerMentorEligibility(@CurrentUser() user: User) {
    return this.drivingLicenseService.getLearnerMentorEligibility(
      user,
      user.nationalId,
    )
  }

  @Scopes(ApiScope.internal)
  @Query(() => [Jurisdiction])
  drivingLicenseListOfJurisdictions() {
    return this.drivingLicenseService.getListOfJurisdictions()
  }

  @Scopes(ApiScope.internal)
  @Query(() => StudentAssessment, { nullable: true })
  drivingLicenseStudentAssessment(@CurrentUser() user: User) {
    return this.drivingLicenseService.getDrivingAssessment(user.nationalId)
  }

  @Scopes(ApiScope.internal)
  @Query(() => StudentCanGetPracticePermit, { nullable: true })
  drivingLicenseStudentCanGetPracticePermit(
    @CurrentUser() user: User,
    @Args('input') input: StudentCanGetPracticePermitInput,
  ) {
    return this.drivingLicenseService.studentCanGetPracticePermit({
      studentSSN: input.studentSSN,
      token: user.authorization.split(' ')?.[1] ?? '', // Need to remove "Bearer" part
    })
  }
}
