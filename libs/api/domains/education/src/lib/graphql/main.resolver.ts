import { Args, Query, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'

import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'

import { EducationService } from '../education.service'
import {
  License,
  SignedLicense,
  FetchEducationSignedLicenseUrlInput,
} from './license'
import { ExamFamilyOverview, ExamResult } from './grade'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly educationService: EducationService) {}

  @Query(() => [License])
  educationLicense(@CurrentUser() user: User): Promise<License[]> {
    return this.educationService.getLicenses(user.nationalId)
  }

  @Mutation(() => SignedLicense, { nullable: true })
  async fetchEducationSignedLicenseUrl(
    @CurrentUser() user: User,
    @Args('input', { type: () => FetchEducationSignedLicenseUrlInput })
    input: FetchEducationSignedLicenseUrlInput,
  ): Promise<SignedLicense> {
    const url = await this.educationService.downloadPdfLicense(
      user.nationalId,
      input.licenseId,
    )
    if (url === null) {
      throw new ApolloError('Could not create a download link')
    }
    return { url }
  }

  @Query(() => [ExamFamilyOverview])
  educationExamFamilyOverviews(
    @CurrentUser() user: User,
  ): Promise<ExamFamilyOverview[]> {
    return this.educationService.getExamFamilyOverviews(user.nationalId)
  }

  @Query(() => ExamResult)
  async educationExamResult(
    @CurrentUser() user: User,
    @Args('nationalId') nationalId: string,
  ): Promise<ExamResult> {
    const family = await this.educationService.getFamily(user.nationalId)
    const familyMember = family.find(
      (familyMember) => familyMember.Kennitala === nationalId,
    )
    if (!familyMember) {
      throw new ApolloError('The requested nationalId is not a part of family')
    }
    return this.educationService.getExamResult(familyMember)
  }
}
