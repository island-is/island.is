import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { InjectModel } from '@nestjs/sequelize'
import { Notification } from '../notifications/notification.model'
import { Op } from 'sequelize'

@Injectable()
export class UserNotificationCleanupWorkerService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
  ) {}

  public async run() {
    await this.deleteSixMonthsAndOlderNotifications()
  }

  async deleteSixMonthsAndOlderNotifications() {
    const rowCountBeforeCleanup = await this.notificationModel.count()
    const sixMonthsAgo = new Date(
      new Date().setMonth(new Date().getMonth() - 6),
    )
    try {
      const destroyedRows = await this.notificationModel.destroy({
        where: {
          created: {
            [Op.lt]: sixMonthsAgo,
          },
        },
      })
      this.logger.info(
        `Cleanup job completed: Deleted ${destroyedRows} rows from a total of ${rowCountBeforeCleanup} rows`,
      )
    } catch (error) {
      this.logger.error(
        `Cleanup job failed with error: ${error.message}`,
        error,
      )
    }
  }
}
