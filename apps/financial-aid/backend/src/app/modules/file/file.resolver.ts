import { Resolver, Context, Mutation, Args } from '@nestjs/graphql'

import { Inject, UseGuards } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { JwtGraphQlAuthGuard } from '@island.is/financial-aid/auth'
import { ApplicationFileModel } from './models/'
import { CreateFileDto } from './dto'
import { ApplicationFile } from '@island.is/financial-aid/shared'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ApplicationFileModel)
export class ApplicationResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => ApplicationFileModel, { nullable: true })
  createFiles(
    @Args('input', { type: () => CreateFileDto })
    input: CreateFileDto,
  ): Promise<ApplicationFile> {
    this.logger.debug('Creating case')

    return
  }
}
