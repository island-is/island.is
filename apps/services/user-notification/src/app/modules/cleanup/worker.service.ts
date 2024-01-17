import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { InjectModel } from '@nestjs/sequelize'
import { Notification } from '../notifications/notification.model'

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
    const currentDate = new Date()
    const sixMonthsAgo = currentDate.setMonth(currentDate.getMonth() - 6) // confirm this ...... test when you know how to probe this worker ...switch to iso ?
    const rowCountBeforeCleanup = await this.notificationModel.count()
    try {
      const destroyedRows = await this.notificationModel.destroy({
        where: {
          created: {
            $lt: sixMonthsAgo,
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
