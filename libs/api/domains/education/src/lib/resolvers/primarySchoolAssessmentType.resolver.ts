import { ApiScope } from '@island.is/auth/scopes'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { PrimarySchoolClientService } from '@island.is/clients/mms/primary-school'
import { PrimarySchoolAssessmentType } from '../models/primarySchool/primarySchoolAssessmentType.model'
import { PrimarySchoolStudentResults } from '../models/primarySchool/primarySchoolStudentResults.model'
import { mapStudentResults } from '../models/primarySchool/primarySchool.mapper'
import type { PrimarySchoolAssessmentTypeWithContext } from '../shared/types'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => PrimarySchoolAssessmentType)
export class PrimarySchoolAssessmentTypeResolver {
  constructor(
    private readonly primarySchoolService: PrimarySchoolClientService,
  ) {}

  @ResolveField(() => [PrimarySchoolStudentResults], { nullable: true })
  @Scopes(ApiScope.education)
  async results(
    @CurrentUser() user: User,
    @Parent() assessmentType: PrimarySchoolAssessmentTypeWithContext,
  ) {
    const results = await this.primarySchoolService.getAssignmentResults(
      user,
      assessmentType.studentId,
      assessmentType.id,
    )
    return results
      ?.map(mapStudentResults)
      .filter((r): r is PrimarySchoolStudentResults => r !== null)
  }
}
