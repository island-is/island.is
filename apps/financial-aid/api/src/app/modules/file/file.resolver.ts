import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { JwtGraphQlAuthGuard } from '@island.is/judicial-system/auth'

import { BackendAPI } from '../../../services'
import { CreateApplicationFileInput, GetSignedUrlInput } from './dto'
import { ApplicationFileModel, SignedUrlModel } from './models'
import { CreateApplicationFile } from '@island.is/financial-aid/shared'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver()
export class FileResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => SignedUrlModel)
  getSignedUrl(
    @Args('input', { type: () => GetSignedUrlInput })
    input: GetSignedUrlInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<SignedUrlModel> {
    this.logger.debug('Creating signed url')
    return backendApi.getSignedUrl(input)
  }

  @Mutation(() => ApplicationFileModel)
  createApplicationFile(
    @Args('input', { type: () => CreateApplicationFileInput })
    input: CreateApplicationFile,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<ApplicationFileModel> {
    this.logger.debug('Creating application files')
    return backendApi.createApplicationFile(input)
  }
}
