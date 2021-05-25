import {
  Args,
  Query,
  Mutation,
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
import { HasTeachingRights } from './hasTeachingRights.model'
import { StudentInformationResult } from './studentInformationResult.model'
import { NewDrivingAssessmentInput } from './newDrivingAssessment.input'
import { ApplicationEligibility } from './applicationEligibility.model'
import { Juristiction } from './juristiction.model'
import { NewDrivingLicenseInput } from './newDrivingLicense.input'
import { NewDrivingLicenseResult } from './newDrivingLicenseResult.model'
import { NewDrivingAssessmentResult } from './newDrivingAssessmentResult.model'

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

  @Mutation(() => NewDrivingAssessmentResult)
  async drivingLicenseNewDrivingAssessment(
    @Args('input') input: NewDrivingAssessmentInput,
    @CurrentUser() user: User,
  ): Promise<NewDrivingAssessmentResult> {
    const response = await this.drivingLicenseService.newDrivingAssessment(
      input.studentNationalId,
      user.nationalId,
    )

    return {
      success: response.ok,
    }
  }

  @Mutation(() => NewDrivingLicenseResult)
  async drivingLicenseNewDrivingLicense(
    @Args('input') input: NewDrivingLicenseInput,
    @CurrentUser() user: User,
  ): Promise<NewDrivingLicenseResult> {
    const response = await this.drivingLicenseService.newDrivingLicense({
      authorityNumber: input.juristictionId,
      needsToPresentHealthCertificate: input.needsToPresentHealthCertificate
        ? 1
        : 0,
      personIdNumber: user.nationalId,
    })

    // service returns 1 for success - string with error message as failure..
    const success = parseInt(response, 10) > 0

    return {
      success,
      errorMessage: success ? null : response,
    }
  }
}
