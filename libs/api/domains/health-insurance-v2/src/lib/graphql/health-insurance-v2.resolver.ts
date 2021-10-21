import { Inject, UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { AccidentStatusInput } from './dto/AccidentStatus.input'
import { AccidentNotificationStatus } from './models/accidentNotificationStatus.model'
import { HealthInsuranceService } from './health-insurance-v2.service'

// @UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => AccidentNotificationStatus)
export class HealthInsuranceResolver {
  constructor(
    private accidentNotificationApi: HealthInsuranceService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  @Query(() => AccidentNotificationStatus, {
    name: 'accidentStatus',
    nullable: true,
  })
  // @Audit()
  async accidentStatus(
    @Args('input', { type: () => AccidentStatusInput })
    input: AccidentStatusInput,
  ): Promise<AccidentNotificationStatus | null> {
    this.logger.debug(`Getting company information`)
    const accidentStatus = await this.accidentNotificationApi.getAccidentNotificationStatus(
      input.ihiDocumentID,
    )
    this.logger.debug(`Getting accident status for id ${input.ihiDocumentID}`)
    if (!accidentStatus) {
      return null
    }
    return accidentStatus
  }
}
