import { Inject } from '@nestjs/common'

import { DelegationConfirmationService } from '@island.is/auth-api-lib'
import { LOGGER_PROVIDER } from '@island.is/logging'

import type { Logger } from '@island.is/logging'

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
