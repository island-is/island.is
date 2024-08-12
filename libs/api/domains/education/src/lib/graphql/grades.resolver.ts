import { ApiScope } from '@island.is/auth/scopes'
import { Args, Query, Mutation, Resolver, Int } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'

import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { Audit, AuditService } from '@island.is/nest/audit'

import { EducationService } from '../education.service'
import {
  EducationLicense,
  EducationSignedLicense,
  FetchEducationSignedLicenseUrlInput,
} from './license'
import { ExamFamilyOverview, ExamResult } from './grade'

@UseGuards(IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/education/grade' })
@Resolver()
export class GradesResolver {
  constructor(private readonly educationService: EducationService) {}

  @Query(() => [ExamFamilyOverview])
  @Scopes(ApiScope.education)
  educationExamFamilyOverviews(
    @CurrentUser() user: User,
  ): Promise<ExamFamilyOverview[]> {
    return this.auditService.auditPromise<ExamFamilyOverview[]>(
      {
        auth: user,
        namespace,
        action: 'educationExamFamilyOverviews',
        resources: (results) => results.map((result) => result.nationalId),
      },
      this.educationService.getExamFamilyOverviews(user.nationalId),
    )
  }

  @Query(() => ExamResult)
  @Scopes(ApiScope.education)
  async educationExamResult(
    @CurrentUser() user: User,
    @Args('familyIndex', { type: () => Int }) familyIndex: number,
  ): Promise<ExamResult> {
    const family = await this.educationService.getFamily(user.nationalId)

    const familyMember = family?.[familyIndex]

    if (!familyMember) {
      throw new ApolloError('The requested nationalId is not a part of family')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'educationExamResult',
        resources: familyMember.nationalId,
      },
      this.educationService.getExamResult(familyMember),
    )
  }
}
