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
import { License } from './license.model'
import { SignedLicense } from './signedLicense.model'
import { FetchEducationSignedLicenseUrlInput } from './license.input'
import { StudentAssessmentGrades } from './grade'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly educationService: EducationService) {}

  @Query(() => [License])
  educationLicense(@CurrentUser() user: User): Promise<License[]> {
    return this.educationService.getLicenses(user.nationalId)
  }

  @Query(() => StudentAssessmentGrades)
  educationStudentAssessmentGrades(
    @CurrentUser() user: User,
  ): Promise<StudentAssessmentGrades[]> {
    return this.educationService.getStudentAssessmentGrades(user.nationalId)
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
}
