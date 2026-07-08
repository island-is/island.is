import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { BackendAPI } from '../../../services'
import {
  CreateApplicationFilesInput,
  GetSignedUrlForIdInput,
  GetSignedUrlInput,
} from './dto'
import { SignedUrlModel, CreateFilesModel } from './models'
import { IdsUserGuard } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard)
@Resolver()
export class FileResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly backendApi: BackendAPI,
  ) {}

  @Mutation(() => SignedUrlModel)
  getSignedUrl(
    @Args('input', { type: () => GetSignedUrlInput })
    input: GetSignedUrlInput,
  ): Promise<SignedUrlModel> {
    this.logger.debug('Creating signed url')
    return this.backendApi.getSignedUrl(input)
  }

  @Mutation(() => CreateFilesModel)
  async createApplicationFiles(
    @Args('input', { type: () => CreateApplicationFilesInput })
    input: CreateApplicationFilesInput,
  ): Promise<CreateFilesModel> {
    this.logger.debug('Creating application files')
    return await this.backendApi.createApplicationFiles(input)
  }

  @Query(() => SignedUrlModel)
  getSignedUrlForId(
    @Args('input', { type: () => GetSignedUrlForIdInput })
    input: GetSignedUrlForIdInput,
  ): Promise<SignedUrlModel> {
    this.logger.debug('Creating signed url for file id')
    return this.backendApi.getSignedUrlForId(input.id)
  }

  @Query(() => [SignedUrlModel])
  getSignedUrlForAllFilesId(
    @Args('input', { type: () => GetSignedUrlForIdInput })
    input: GetSignedUrlForIdInput,
  ): Promise<SignedUrlModel[]> {
    return this.backendApi.getSignedUrlForAllFiles(input.id)
  }
}
