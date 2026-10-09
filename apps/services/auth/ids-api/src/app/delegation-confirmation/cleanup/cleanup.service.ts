import { Inject } from '@nestjs/common'

import { DelegationConfirmationService } from '@island.is/auth-api-lib'
import { LOGGER_PROVIDER } from '@island.is/logging'

import type { Logger } from '@island.is/logging'

/**
 * Marks elapsed delegation confirmations as expired.
 *
 * Deliberately only touches rows still awaiting confirmation. A confirmed row is
 * the evidence that a delegation was granted and must outlive the delegation
 * itself, so it is never expired and never deleted here.
 */
export class CleanupDelegationConfirmationService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly delegationConfirmationService: DelegationConfirmationService,
  ) {}

  public async run() {
    const timer = this.logger.startTimer()
    this.logger.info('Worker starting...')

    this.logger.info('Expiring elapsed delegation confirmations...')
    const expired = await this.delegationConfirmationService.expirePending()

    if (expired > 0) {
      this.logger.info(`Finished expiring ${expired} delegation confirmations.`)
    } else {
      this.logger.info('No delegation confirmations found to expire.')
    }

    this.logger.info('Worker finished.')
    timer.done()
  }
}
