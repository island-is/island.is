import { Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import subMonths from 'date-fns/subMonths'
import { Op } from 'sequelize'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { environment } from '../../environments'
import { Session } from '../sessions/session.model'

import type { Logger } from '@island.is/logging'
export class SessionsCleanupService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @InjectModel(Session)
    private readonly sessionModel: typeof Session,
  ) {}

  public async run() {
    const timer = this.logger.startTimer()
    this.logger.info('Worker starting...')

    await this.deleteOlderSessions()

    this.logger.info('Worker finished.')
    timer.done()
  }

  private async deleteOlderSessions() {
    this.logger.info(`Checking for rows to delete...`)

    const filter = {
      where: {
        timestamp: {
          [Op.lt]: subMonths(new Date(), environment.cleanup.retentionInMonths),
        },
      },
    }

    const rowsRemaining = await this.sessionModel.count(filter)

    if (rowsRemaining > 0) {
      this.logger.info(`Found ${rowsRemaining} rows to delete, deleting...`)

      const affectedRows: number = await this.sessionModel.destroy(filter)

      this.logger.info(`Finished deleting ${affectedRows} rows.`)
    } else {
      this.logger.info(`No rows found to delete.`)
    }
  }
}
