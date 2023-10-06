import { Inject, UseGuards } from '@nestjs/common'
import { Context, Query, Resolver } from '@nestjs/graphql'

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
import { Institution } from './institution.model'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Institution)
export class InstitutionResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => [Institution], { nullable: true })
  institutions(
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
  ): Promise<Institution[]> {
    this.logger.debug('Getting all institutions')

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_INSTITUTIONS,
      backendApi.getInstitutions(),
      (institutions: Institution[]) =>
        institutions.map((institution) => institution.id),
    )
  }
}
