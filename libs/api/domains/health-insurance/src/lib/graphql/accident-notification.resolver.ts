import { Inject, UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import { ApiScope } from '@island.is/auth/scopes'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { HealthInsuranceAccidentStatusInput } from './dto/accidentStatus.input'
import { AccidentNotificationStatus } from './models/accidentNotificationStatus.model'
import { AccidentNotificationService } from '../accident-notification.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver(() => AccidentNotificationStatus)
export class HealthInsuranceAccidentNotificationResolver {
  constructor(
    private accidentNotificationService: AccidentNotificationService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  @Query(() => AccidentNotificationStatus, {
    name: 'HealthInsuranceAccidentStatus',
    nullable: true,
  })
  @Audit()
  async accidentStatus(
    @Args('input', { type: () => HealthInsuranceAccidentStatusInput })
    input: HealthInsuranceAccidentStatusInput,
    @CurrentUser() user: AuthUser,
  ): Promise<AccidentNotificationStatus | null> {
    this.logger.debug(`Getting company information`)
    const accidentStatus =
      await this.accidentNotificationService.getAccidentNotificationStatus(
        user,
        input.ihiDocumentID,
      )
    this.logger.debug(`Getting accident status for id ${input.ihiDocumentID}`)
    if (!accidentStatus) {
      return null
    }
    return accidentStatus
  }
}
