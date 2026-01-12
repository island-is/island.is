import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import { PracticalExamsService } from './practicalExams.service'
import { FeatureFlagGuard } from '@island.is/nest/feature-flags'
import { ValidateInstructorInput } from './dto/validaInstructorInput.input'
import { PracticalExamInstructor } from './models/practicalExamInstructor'
import { CompanyValidationItem } from './models/companyValidation'
import { ExamineeEligibility } from './models/examineeEligibility'
import { ExamineeEligibilityInput } from './dto/examineeEligibilityInput.input'
import { WorkMachineExamineeValidation } from './models/examineeValidation'
import { ExamineeValidationInput } from './dto/examineeValidationInput.input'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/practical-exams' })
export class PracticalExamsResolver {
  constructor(private readonly practicalExamsService: PracticalExamsService) {}

  @Query(() => CompanyValidationItem, { name: 'practicalExamIsCompanyValid' })
  @Audit()
  async isCompanyValid(
    @CurrentUser() auth: User,
    @Args('nationalId') nationalId: string,
  ) {
    return this.practicalExamsService.isCompanyValid(auth, nationalId)
  }

  @Query(() => [ExamineeEligibility])
  @Audit()
  async getExamineeEligibility(
    @CurrentUser() auth: User,
    @Args('input', {
      type: () => ExamineeEligibilityInput,
    })
    input: ExamineeEligibilityInput,
  ) {
    return this.practicalExamsService.getExamineeEligibility(auth, input)
  }

  @Query(() => WorkMachineExamineeValidation)
  @Audit()
  async getExamineeValidation(
    @CurrentUser() auth: User,
    @Args('input', {
      type: () => ExamineeValidationInput,
    })
    input: ExamineeValidationInput,
  ) {
    return this.practicalExamsService.getExamineeValidation(auth, input)
  }

  @Scopes(ApiScope.vinnueftirlitid)
  @Query(() => PracticalExamInstructor)
  @Audit()
  async validateInstructor(
    @CurrentUser() auth: User,
    @Args('input', {
      type: () => ValidateInstructorInput,
    })
    input: ValidateInstructorInput,
  ) {
    return this.practicalExamsService.validateInstructor(auth, input)
  }
}
