import { Inject, UseGuards } from '@nestjs/common'
import { Args, Context, Query, Resolver } from '@nestjs/graphql'

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
import { User } from '@island.is/judicial-system/types'

import { BackendAPI } from '../../../services'
import { PoliceCaseFilesQueryInput } from './dto'
import { PoliceCaseFile } from './models'

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
}
