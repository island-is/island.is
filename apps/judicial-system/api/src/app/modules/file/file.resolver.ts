import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'
import { AuditedAction } from '@island.is/judicial-system/audit-trail'
import { User } from '@island.is/judicial-system/types'

import { BackendAPI } from '../../../services'
import { AuditService } from '../audit'
import { CreateFileInput, CreatePresignedPostInput } from './dto'
import { PresignedPost, File } from './models'

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

    this.logger.debug(`Creating a presigned post for case ${caseId}`)

    return this.auditService.audit(
      user.id,
      AuditedAction.CREATE_PRESIGNED_POST,
      backendApi.createCasePresignedPost(caseId, createPresignedPost),
      caseId,
    )
  }

  @Mutation(() => File)
  createFile(
    @Args('input', { type: () => CreateFileInput })
    input: CreateFileInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<File> {
    const { caseId, ...createFile } = input

    this.logger.debug(`Creating a file for case ${caseId}`)

    return this.auditService.audit(
      user.id,
      AuditedAction.CREATE_FILE,
      backendApi.createCaseFile(caseId, createFile),
      (file) => file.id,
    )
  }
}
