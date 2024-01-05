import { Inject, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'

import { BackendApi } from '../../data-sources'
import { CreateFileInput } from './dto/createFile.input'
import { CreatePresignedPostInput } from './dto/createPresignedPost.input'
import { DeleteFileInput } from './dto/deleteFile.input'
import { GetSignedUrlInput } from './dto/getSignedUrl.input'
import { DeleteFileResponse } from './models/deleteFile.response'
import { CaseFile } from './models/file.model'
import { PresignedPost } from './models/presignedPost.model'
import { SignedUrl } from './models/signedUrl.model'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver()
export class LimitedAccessFileResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => PresignedPost)
  limitedAccessCreatePresignedPost(
    @Args('input', { type: () => CreatePresignedPostInput })
    input: CreatePresignedPostInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
  ): Promise<PresignedPost> {
    const { caseId, ...createPresignedPost } = input

    this.logger.debug(`Creating a presigned post for case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_PRESIGNED_POST,
      backendApi.limitedAccessCreateCasePresignedPost(
        caseId,
        createPresignedPost,
      ),
      caseId,
    )
  }

  @Mutation(() => CaseFile)
  limitedAccessCreateFile(
    @Args('input', { type: () => CreateFileInput })
    input: CreateFileInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
  ): Promise<CaseFile> {
    const { caseId, ...createFile } = input

    this.logger.debug(`Creating a file for case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_FILE,
      backendApi.limitedAccessCreateCaseFile(caseId, createFile),
      (file) => file.id,
    )
  }

  @Query(() => SignedUrl, { nullable: true })
  limitedAccessGetSignedUrl(
    @Args('input', { type: () => GetSignedUrlInput })
    input: GetSignedUrlInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
  ): Promise<SignedUrl> {
    const { caseId, id } = input

    this.logger.debug(`Getting a signed url for file ${id} of case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_SIGNED_URL,
      backendApi.limitedAccessGetCaseFileSignedUrl(caseId, id),
      id,
    )
  }

  @Mutation(() => DeleteFileResponse)
  limitedAccessDeleteFile(
    @Args('input', { type: () => DeleteFileInput })
    input: DeleteFileInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
  ): Promise<DeleteFileResponse> {
    const { caseId, id } = input

    this.logger.debug(`Deleting file ${id} of case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.DELETE_FILE,
      backendApi.limitedAccessDeleteCaseFile(caseId, id),
      id,
    )
  }
}
