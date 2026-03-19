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
import { DeletePoliceDigitalCaseFileInput } from './dto/deletePoliceDigitalCaseFile.input'
import { PoliceDigitalCaseFilesQueryInput } from './dto/policeDigitalCaseFiles.input'
import { DeleteFileResponse } from './models/deleteFile.response'
import { PoliceDigitalCaseFile } from './models/policeDigitalCaseFile.model'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver()
export class PoliceDigitalCaseFileResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => [PoliceDigitalCaseFile], { nullable: true })
  policeDigitalCaseFiles(
    @Args('input', { type: () => PoliceDigitalCaseFilesQueryInput })
    input: PoliceDigitalCaseFilesQueryInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<PoliceDigitalCaseFile[]> {
    this.logger.debug(
      `Syncing and getting police digital case files for case ${input.caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_POLICE_DIGITAL_CASE_FILES,
      backendService.getPoliceDigitalCaseFiles(input.caseId),
      input.caseId,
    )
  }

  @Mutation(() => DeleteFileResponse)
  deletePoliceDigitalCaseFile(
    @Args('input', { type: () => DeletePoliceDigitalCaseFileInput })
    input: DeletePoliceDigitalCaseFileInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<DeleteFileResponse> {
    const { caseId, fileId } = input

    this.logger.debug(
      `Deleting police digital case file ${fileId} for case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.DELETE_POLICE_DIGITAL_CASE_FILE,
      backendService.deletePoliceDigitalCaseFile(caseId, fileId),
      fileId,
    )
  }
}
