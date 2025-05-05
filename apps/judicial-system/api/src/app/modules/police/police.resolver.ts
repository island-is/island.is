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
import { PoliceCaseFilesQueryInput } from './dto/policeCaseFiles.input'
import { PoliceCaseInfoQueryInput } from './dto/policeCaseInfo.input'
import { UploadPoliceCaseFileInput } from './dto/uploadPoliceCaseFile.input'
import { PoliceCaseFile } from './models/policeCaseFile.model'
import { PoliceCaseInfo } from './models/policeCaseInfo.model'
import { UploadPoliceCaseFileResponse } from './models/uploadPoliceCaseFile.response'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver()
export class PoliceResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => [PoliceCaseFile], { nullable: true })
  policeCaseFiles(
    @Args('input', { type: () => PoliceCaseFilesQueryInput })
    input: PoliceCaseFilesQueryInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<PoliceCaseFile[]> {
    this.logger.debug(`Getting all police case files for case ${input.caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_POLICE_CASE_FILES,
      backendService.getPoliceCaseFiles(input.caseId),
      input.caseId,
    )
  }

  @Query(() => [PoliceCaseInfo], { nullable: true })
  policeCaseInfo(
    @Args('input', { type: () => PoliceCaseInfoQueryInput })
    input: PoliceCaseInfoQueryInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<PoliceCaseInfo[]> {
    this.logger.debug(`Getting all police case info for case ${input.caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_POLICE_CASE_INFO,
      backendService.getPoliceCaseInfo(input.caseId),
      input.caseId,
    )
  }

  @Mutation(() => UploadPoliceCaseFileResponse, { nullable: true })
  uploadPoliceCaseFile(
    @Args('input', { type: () => UploadPoliceCaseFileInput })
    input: UploadPoliceCaseFileInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<UploadPoliceCaseFileResponse> {
    const { caseId, ...uploadPoliceFile } = input
    this.logger.debug(
      `Uploading police case file ${input.id} of case ${caseId} to AWS S3`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPLOAD_POLICE_CASE_FILE,
      backendService.uploadPoliceFile(input.caseId, uploadPoliceFile),
      input.caseId,
    )
  }
}
