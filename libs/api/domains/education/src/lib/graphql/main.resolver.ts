import { Args, Query, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards, Inject } from '@nestjs/common'
import { uuid } from 'uuidv4'
import { ApolloError } from 'apollo-server-express'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  IdsAuthGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'

import { Config } from '../education.module'
import { S3Service } from '../s3.service'
import { EducationService } from '../education.service'
import { License } from './license.model'
import { SignedLicense } from './signedLicense.model'
import { FetchEducationSignedLicenseUrlInput } from './license.input'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(
    private readonly educationService: EducationService,
    private readonly s3Service: S3Service,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject('CONFIG')
    private readonly config: Config,
  ) {}

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
    const responseStream = await this.educationService.downloadPdfLicense(
      user.nationalId,
      input.licenseId,
    )

    const url = await this.s3Service.uploadFileFromStream(responseStream, {
      fileName: uuid(),
      bucket: this.config.fileDownloadBucket,
    })
    if (url === null) {
      throw new ApolloError('Could not create a download link')
    }
    return { url }
  }
}
