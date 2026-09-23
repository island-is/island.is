import { Inject, UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'

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
import { Institution } from './institution.model'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver(() => Institution)
export class InstitutionResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly backendService: BackendService,
  ) {}

  @Query(() => [Institution], { nullable: true })
  institutions(@CurrentGraphQlUser() user: User): Promise<Institution[]> {
    this.logger.debug('Getting all institutions')

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_INSTITUTIONS,
      this.backendService.getInstitutions(),
      (institutions: Institution[]) =>
        institutions.map((institution) => institution.id),
    )
  }
}
