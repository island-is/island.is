import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'
import { User } from '@island.is/judicial-system/types'

import { BackendAPI } from '../../../services'
import { AuditService } from '../audit'
import { CreatePresignedPostInput } from './dto'
import { PresignedPost } from './models'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver()
export class FileResolver {
  constructor(
    private readonly auditService: AuditService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => PresignedPost)
  createPresignedPost(
    @Args('input', { type: () => CreatePresignedPostInput })
    input: CreatePresignedPostInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<PresignedPost> {
    const { caseId, ...createPresignedPost } = input

    this.logger.debug(`Creating a presign post for case ${caseId}`)

    return backendApi.createPresignedPost(caseId, createPresignedPost)
  }
}
