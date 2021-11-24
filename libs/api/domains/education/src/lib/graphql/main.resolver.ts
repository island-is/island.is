import { Args, Query, Mutation, Resolver, Int } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'

import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { AuditService } from '@island.is/nest/audit'

import { EducationService } from '../education.service'
import {
  EducationLicense,
  EducationSignedLicense,
  FetchEducationSignedLicenseUrlInput,
} from './license'
import { ExamFamilyOverview, ExamResult } from './grade'

const namespace = '@island.is/api/education'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(
    private readonly educationService: EducationService,
    private readonly auditService: AuditService,
  ) {}

  @Query(() => [EducationLicense])
  educationLicense(@CurrentUser() user: User): Promise<EducationLicense[]> {
    return this.auditService.auditPromise<EducationLicense[]>(
      {
        user,
        namespace,
        action: 'educationLicense',
        resources: (licenses) => licenses.map((license) => license.id),
      },
      this.educationService.getLicenses(user.nationalId),
    )
  }

  @Mutation(() => EducationSignedLicense, { nullable: true })
  async fetchEducationSignedLicenseUrl(
    @CurrentUser() user: User,
    @Args('input', { type: () => FetchEducationSignedLicenseUrlInput })
    input: FetchEducationSignedLicenseUrlInput,
  ): Promise<EducationSignedLicense> {
    const url = await this.educationService.downloadPdfLicense(
      user.nationalId,
      input.licenseId,
    )
    if (url === null) {
      throw new ApolloError('Could not create a download link')
    }

    this.auditService.audit({
      user,
      namespace,
      action: 'fetchEducationSignedicenseUrl',
      resources: input.licenseId,
    })

    return { url }
  }

  @Query(() => [ExamFamilyOverview])
  educationExamFamilyOverviews(
    @CurrentUser() user: User,
  ): Promise<ExamFamilyOverview[]> {
    return this.auditService.auditPromise<ExamFamilyOverview[]>(
      {
        user,
        namespace,
        action: 'educationExamFamilyOverviews',
        resources: (results) => results.map((result) => result.nationalId),
      },
      this.educationService.getExamFamilyOverviews(user.nationalId),
    )
  }

  @Query(() => ExamResult)
  async educationExamResult(
    @CurrentUser() user: User,
    @Args('familyIndex', { type: () => Int }) familyIndex: number,
  ): Promise<ExamResult> {
    const family = await this.educationService.getFamily(user.nationalId)
    const familyMember = family[familyIndex]

    if (!familyMember) {
      throw new ApolloError('The requested nationalId is not a part of family')
    }

    return this.auditService.auditPromise(
      {
        user,
        namespace,
        action: 'educationExamResult',
        resources: familyMember.Kennitala,
      },
      this.educationService.getExamResult(familyMember),
    )
  }
}
