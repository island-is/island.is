import { Inject } from '@nestjs/common'

import { GrantsService } from '@island.is/auth-api-lib'
import { LOGGER_PROVIDER } from '@island.is/logging'

import type { Logger } from '@island.is/logging'

export class CleanupService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly grantsService: GrantsService,
  ) {}

  public async run() {
    const timer = this.logger.startTimer()
    this.logger.info('Worker starting...')

    this.logger.info(`Deleting expired grants...`)
    const deletedGrants: number = await this.grantsService.deleteExpired()

    if (deletedGrants > 0) {
      this.logger.info(`Finished deleting ${deletedGrants} grants.`)
    } else {
      this.logger.info(`No grants found to delete.`)
    }

    this.logger.info('Worker finished.')
    timer.done()
  }
}
