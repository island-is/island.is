import { Inject, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthUserGuard,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { CreateCivilClaimantFileInput } from './dto/createCivilClaimantFile.input'
import { CreateDefendantFileInput } from './dto/createDefendantFile.input'
import { CreateFileInput } from './dto/createFile.input'
import { CreatePresignedPostInput } from './dto/createPresignedPost.input'
import { DeleteFileInput } from './dto/deleteFile.input'
import { GetSignedUrlInput } from './dto/getSignedUrl.input'
import { DeleteFileResponse } from './models/deleteFile.response'
import { CaseFile } from './models/file.model'
import { PresignedPost } from './models/presignedPost.model'
import { SignedUrl } from './models/signedUrl.model'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver()
export class LimitedAccessFileResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly backendService: BackendService,
  ) {}

  @Mutation(() => PresignedPost)
  limitedAccessCreatePresignedPost(
    @Args('input', { type: () => CreatePresignedPostInput })
    input: CreatePresignedPostInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<PresignedPost> {
    const { caseId, ...createPresignedPost } = input

    this.logger.debug(`Creating a presigned post for case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_PRESIGNED_POST,
      this.backendService.limitedAccessCreateCasePresignedPost(
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
  ): Promise<CaseFile> {
    const { caseId, ...createFile } = input

    this.logger.debug(`Creating a file for case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_FILE,
      this.backendService.limitedAccessCreateCaseFile(caseId, createFile),
      (file) => file.id,
    )
  }

  @Mutation(() => CaseFile)
  limitedAccessCreateDefendantFile(
    @Args('input', { type: () => CreateDefendantFileInput })
    input: CreateDefendantFileInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<CaseFile> {
    const { caseId, defendantId, ...createFile } = input

    this.logger.debug(
      `Creating a file for case ${caseId} and defendant ${defendantId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_FILE,
      this.backendService.limitedAccessCreateDefendantCaseFile(
        caseId,
        createFile,
        defendantId,
      ),
      (file) => file.id,
    )
  }

  @Mutation(() => CaseFile)
  limitedAccessCreateCivilClaimantFile(
    @Args('input', { type: () => CreateCivilClaimantFileInput })
    input: CreateCivilClaimantFileInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<CaseFile> {
    const { caseId, civilClaimantId, ...createFile } = input

    this.logger.debug(
      `Creating a file for case ${caseId} and civil claimant ${civilClaimantId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_FILE,
      this.backendService.limitedAccessCreateCivilClaimantCaseFile(
        caseId,
        createFile,
        civilClaimantId,
      ),
      (file) => file.id,
    )
  }

  @Query(() => SignedUrl, { nullable: true })
  limitedAccessGetSignedUrl(
    @Args('input', { type: () => GetSignedUrlInput })
    input: GetSignedUrlInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<SignedUrl> {
    const { caseId, id, mergedCaseId } = input

    this.logger.debug(`Getting a signed url for file ${id} of case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_SIGNED_URL,
      this.backendService.limitedAccessGetCaseFileSignedUrl(
        caseId,
        id,
        mergedCaseId,
      ),
      id,
    )
  }

  @Mutation(() => DeleteFileResponse)
  limitedAccessDeleteFile(
    @Args('input', { type: () => DeleteFileInput })
    input: DeleteFileInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<DeleteFileResponse> {
    const { caseId, id } = input

    this.logger.debug(`Deleting file ${id} of case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.DELETE_FILE,
      this.backendService.limitedAccessDeleteCaseFile(caseId, id),
      id,
    )
  }
}
