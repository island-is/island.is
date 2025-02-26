import { ApiScope } from '@island.is/auth/scopes'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { EducationServiceV2 } from '../../services/educationV2.service'
import {
  ExamFamilyMemberInput,
  FamilyPrimarySchoolCareer,
  StudentCareer,
} from '../../models'

@UseGuards(IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/education/primarySchool' })
@Resolver()
export class PrimarySchoolResolver {
  constructor(private readonly educationService: EducationServiceV2) {}

  @Query(() => FamilyPrimarySchoolCareer)
  @Scopes(ApiScope.education)
  @Audit()
  userFamilyPrimarySchoolExamResults(
    @CurrentUser() user: User,
  ): Promise<FamilyPrimarySchoolCareer | null> {
    const data = this.educationService.getPrimarySchoolExamResults(user)
    return this.educationService.familyCareers(user)
  }

  @Query(() => StudentCareer)
  @Scopes(ApiScope.education)
  @Audit()
  userFamilyMemberPrimarySchoolExamResults(
    @CurrentUser() user: User,
    @Args('input') input: ExamFamilyMemberInput,
  ): Promise<StudentCareer | null> {
    return this.educationService.familyMemberCareer(user, input)
  }
}
