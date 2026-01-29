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
  JwtGraphQlAuthUserGuard,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { CreateCivilClaimantFileInput } from './dto/createCivilClaimantFile.input'
import { CreateCriminalRecordInput } from './dto/createCriminalRecord.input'
import { CreateDefendantFileInput } from './dto/createDefendantFile.input'
import { CreateFileInput } from './dto/createFile.input'
import { CreatePresignedPostInput } from './dto/createPresignedPost.input'
import { DeleteFileInput } from './dto/deleteFile.input'
import { GetSignedUrlInput } from './dto/getSignedUrl.input'
import { RejectFileInput } from './dto/rejectFile.input'
import { UpdateFilesInput } from './dto/updateFiles.input'
import { UploadFileToCourtInput } from './dto/uploadFileToCourt.input'
import { DeleteFileResponse } from './models/deleteFile.response'
import { CaseFile } from './models/file.model'
import { PresignedPost } from './models/presignedPost.model'
import { SignedUrl } from './models/signedUrl.model'
import { UpdateFilesResponse } from './models/updateFiles.response'
import { UploadCriminalRecordFileResponse } from './models/uploadCriminalRecordFile.response'
import { UploadFileToCourtResponse } from './models/uploadFileToCourt.response'

@UseGuards(JwtGraphQlAuthUserGuard)
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
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<PresignedPost> {
    const { caseId, ...createPresignedPost } = input

    this.logger.debug(`Creating a presigned post for case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_PRESIGNED_POST,
      backendService.createCasePresignedPost(caseId, createPresignedPost),
      caseId,
    )
  }

  @Mutation(() => CaseFile)
  createFile(
    @Args('input', { type: () => CreateFileInput })
    input: CreateFileInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<CaseFile> {
    const { caseId, ...createFile } = input

    this.logger.debug(`Creating a file for case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_FILE,
      backendService.createCaseFile(caseId, createFile),
      (file) => file.id,
    )
  }

  @Mutation(() => CaseFile)
  createDefendantFile(
    @Args('input', { type: () => CreateDefendantFileInput })
    input: CreateDefendantFileInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<CaseFile> {
    const { caseId, defendantId, ...createFile } = input

    this.logger.debug(
      `Creating a file for case ${caseId} and defendant ${defendantId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_FILE,
      backendService.createDefendantCaseFile(caseId, createFile, defendantId),
      (file) => file.id,
    )
  }

  @Mutation(() => UploadCriminalRecordFileResponse)
  uploadCriminalRecordFile(
    @Args('input', { type: () => CreateCriminalRecordInput })
    input: CreateCriminalRecordInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<UploadCriminalRecordFileResponse> {
    const { caseId, defendantId } = input
    this.logger.debug(
      `Uploading the latest criminal record file for defendant ${defendantId} of case ${caseId} to S3`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPLOAD_CRIMINAL_RECORD_CASE_FILE,
      backendService.uploadCriminalRecordFile(caseId, defendantId),
      input.caseId,
    )
  }

  @Mutation(() => CaseFile)
  createCivilClaimantFile(
    @Args('input', { type: () => CreateCivilClaimantFileInput })
    input: CreateCivilClaimantFileInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<CaseFile> {
    const { caseId, civilClaimantId, ...createFile } = input

    this.logger.debug(
      `Creating a file for case ${caseId} and civil claimant ${civilClaimantId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_FILE,
      backendService.createCivilClaimantCaseFile(
        caseId,
        createFile,
        civilClaimantId,
      ),
      (file) => file.id,
    )
  }

  @Query(() => SignedUrl, { nullable: true })
  getSignedUrl(
    @Args('input', { type: () => GetSignedUrlInput })
    input: GetSignedUrlInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<SignedUrl> {
    const { caseId, id, mergedCaseId } = input

    this.logger.debug(`Getting a signed url for file ${id} of case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_SIGNED_URL,
      backendService.getCaseFileSignedUrl(caseId, id, mergedCaseId),
      id,
    )
  }

  @Mutation(() => CaseFile)
  rejectFile(
    @Args('input', { type: () => RejectFileInput })
    input: RejectFileInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<CaseFile> {
    const { caseId, id } = input

    this.logger.debug(`Rejecting file ${id} of case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.REJECT_FILE,
      backendService.rejectCaseFile(caseId, id),
      id,
    )
  }

  @Mutation(() => DeleteFileResponse)
  deleteFile(
    @Args('input', { type: () => DeleteFileInput })
    input: DeleteFileInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<DeleteFileResponse> {
    const { caseId, id } = input

    this.logger.debug(`Deleting file ${id} of case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.DELETE_FILE,
      backendService.deleteCaseFile(caseId, id),
      id,
    )
  }

  @Mutation(() => UploadFileToCourtResponse)
  uploadFileToCourt(
    @Args('input', { type: () => UploadFileToCourtInput })
    input: UploadFileToCourtInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<UploadFileToCourtResponse> {
    const { caseId, id } = input

    this.logger.debug(`Uploading file ${id} of case ${caseId} to court`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPLOAD_FILE_TO_COURT,
      backendService.uploadCaseFileToCourt(caseId, id),
      id,
    )
  }

  @Mutation(() => UpdateFilesResponse)
  updateFiles(
    @Args('input', { type: () => UpdateFilesInput })
    input: UpdateFilesInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<UpdateFilesResponse> {
    const { caseId, files } = input

    this.logger.debug(`Updating files of case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_FILES,
      backendService.updateFiles(caseId, files),
      (response) => response.caseFiles.map((f) => f.id),
    )
  }
}
