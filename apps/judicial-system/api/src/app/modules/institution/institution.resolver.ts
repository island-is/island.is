import { Inject, UseGuards } from '@nestjs/common'
import { Context, Query, Resolver } from '@nestjs/graphql'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'
import { AuditedAction } from '@island.is/judicial-system/audit-trail'
import { User } from '@island.is/judicial-system/types'

import { BackendAPI } from '../../../services'
import { AuditService } from '../audit'
import { Institution } from './institution.model'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Institution)
export class InstitutionResolver {
  constructor(
    private readonly auditService: AuditService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => [Institution], { nullable: true })
  institutions(
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Institution[]> {
    this.logger.debug('Getting all institutions')

    return this.auditService.audit(
      user.id,
      AuditedAction.GET_INSTITUTIONS,
      backendApi.getInstitutions(),
      (institutions: Institution[]) =>
        institutions.map((institution) => institution.id),
    )
  }
}
