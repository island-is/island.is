import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { JwtGraphQlAuthGuard } from '@island.is/judicial-system/auth'

import { BackendAPI } from '../../../services'
import { GetSignedUrlDto } from './dto'
import { SignedUrlModel } from './models'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver()
export class FileResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => SignedUrlModel)
  getSignedUrl(
    @Args('input', { type: () => GetSignedUrlDto })
    input: GetSignedUrlDto,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<SignedUrlModel> {
    this.logger.debug('Creating signed url')
    return backendApi.getSignedUrl(input)
  }
}
