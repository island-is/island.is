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
import { CasePoliceDigitalCaseFilesQueryInput } from './dto/casePoliceDigitalCaseFiles.input'
import { CreatePoliceDigitalCaseFileInput } from './dto/createPoliceDigitalCaseFile.input'
import { CasePoliceDigitalCaseFile } from './models/policeDigitalCaseFile.model'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver()
export class PoliceDigitalCaseFileResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => CasePoliceDigitalCaseFile)
  createPoliceDigitalCaseFile(
    @Args('input', { type: () => CreatePoliceDigitalCaseFileInput })
    input: CreatePoliceDigitalCaseFileInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<CasePoliceDigitalCaseFile> {
    const { caseId, ...dto } = input

    this.logger.debug(
      `Creating police digital case file for case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_POLICE_DIGITAL_CASE_FILE,
      backendService.createPoliceDigitalCaseFile(caseId, dto),
      (file) => file.id,
    )
  }

  @Query(() => [CasePoliceDigitalCaseFile], { nullable: true })
  casePoliceDigitalCaseFiles(
    @Args('input', { type: () => CasePoliceDigitalCaseFilesQueryInput })
    input: CasePoliceDigitalCaseFilesQueryInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<CasePoliceDigitalCaseFile[]> {
    this.logger.debug(
      `Getting police digital case files for case ${input.caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_CASE_POLICE_DIGITAL_CASE_FILES,
      backendService.getCasePoliceDigitalCaseFiles(
        input.caseId,
        input.policeCaseNumber,
      ),
      input.caseId,
    )
  }
}
