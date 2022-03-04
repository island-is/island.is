import { Inject, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'

import { BackendAPI } from '../../../services'
import { PoliceCaseFilesQueryInput, UploadPoliceCaseFileInput } from './dto'
import { PoliceCaseFile, UploadPoliceCaseFileResponse } from './models'

@UseGuards(JwtGraphQlAuthGuard)
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
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<PoliceCaseFile[]> {
    this.logger.debug(`Getting all police case files for case ${input.caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_POLICE_CASE_FILES,
      backendApi.getPoliceCaseFiles(input.caseId),
      input.caseId,
    )
  }

  @Mutation(() => UploadPoliceCaseFileResponse, { nullable: true })
  uploadPoliceCaseFile(
    @Args('input', { type: () => UploadPoliceCaseFileInput })
    input: UploadPoliceCaseFileInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<UploadPoliceCaseFileResponse> {
    const { caseId, ...uploadPoliceFile } = input
    this.logger.debug(
      `Uploading police case file ${input.id} of case ${caseId} to AWS S3`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPLOAD_POLICE_CASE_FILE,
      backendApi.uploadPoliceFile(input.caseId, uploadPoliceFile),
      input.caseId,
    )
  }
}
