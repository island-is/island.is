import { Inject } from '@nestjs/common'

import { IdentityConfirmationService } from '@island.is/auth-api-lib'
import { LOGGER_PROVIDER } from '@island.is/logging'

import type { Logger } from '@island.is/logging'

export class CleanupConfirmIdentityService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly identityConfirmationService: IdentityConfirmationService,
  ) {}

  public async run() {
    const timer = this.logger.startTimer()
    this.logger.info('Worker starting...')

    this.logger.info(`Deleting expired identity confirmation...`)
    const deletedGrants: number =
      await this.identityConfirmationService.deleteExpiredIdentityConfirmations()

    if (deletedGrants > 0) {
      this.logger.info(
        `Finished deleting ${deletedGrants} identity confirmations.`,
      )
    } else {
      this.logger.info(`No identity confirmations found to delete.`)
    }

    this.logger.info('Worker finished.')
    timer.done()
  }
}
