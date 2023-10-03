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
import { UpdateFilesInput } from './dto/updateFiles.input'
import { UploadFileToCourtInput } from './dto/uploadFileToCourt.input'
import { DeleteFileResponse } from './models/deleteFile.response'
import { CaseFile } from './models/file.model'
import { PresignedPost } from './models/presignedPost.model'
import { SignedUrl } from './models/signedUrl.model'
import { UpdateFilesResponse } from './models/updateFiles.response'
import { UploadFileToCourtResponse } from './models/uploadFileToCourt.response'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver()
export class FileResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => PresignedPost)
  createPresignedPost(
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
      backendApi.createCasePresignedPost(caseId, createPresignedPost),
      caseId,
    )
  }

  @Mutation(() => CaseFile)
  createFile(
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
      backendApi.createCaseFile(caseId, createFile),
      (file) => file.id,
    )
  }

  @Query(() => SignedUrl, { nullable: true })
  getSignedUrl(
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
      backendApi.getCaseFileSignedUrl(caseId, id),
      id,
    )
  }

  @Mutation(() => DeleteFileResponse)
  deleteFile(
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
      backendApi.deleteCaseFile(caseId, id),
      id,
    )
  }

  @Mutation(() => UploadFileToCourtResponse)
  uploadFileToCourt(
    @Args('input', { type: () => UploadFileToCourtInput })
    input: UploadFileToCourtInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
  ): Promise<UploadFileToCourtResponse> {
    const { caseId, id } = input

    this.logger.debug(`Uploading file ${id} of case ${caseId} to court`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPLOAD_FILE_TO_COURT,
      backendApi.uploadCaseFileToCourt(caseId, id),
      id,
    )
  }

  @Mutation(() => UpdateFilesResponse)
  updateFiles(
    @Args('input', { type: () => UpdateFilesInput })
    input: UpdateFilesInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
  ): Promise<UpdateFilesResponse> {
    const { caseId, files } = input

    this.logger.debug(`Updating files of case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_FILES,
      backendApi.updateFiles(caseId, files),
      (response) => response.caseFiles.map((f) => f.id),
    )
  }
}
