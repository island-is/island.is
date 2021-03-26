import { Args, Query, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'

import {
  IdsAuthGuard,
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

@UseGuards(IdsAuthGuard, ScopesGuard)
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

  @Query(() => [ExamResult])
  async educationExamResults(
    @CurrentUser() user: User,
    @Args('nationalId') nationalId: string,
  ): Promise<ExamResult[]> {
    const family = await this.educationService.getFamily(user.nationalId)
    const isFamily = family.some(
      (familyMember) => familyMember.Kennitala === nationalId,
    )
    if (!isFamily) {
      throw new ApolloError('The requested nationalId is not a part of family')
    }
    return this.educationService.getExamResults(nationalId)
  }
}
