import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { TrackedNotificationType } from '@island.is/judicial-system/types'

import { Notification, Recipient } from '../models/notification.model'

export type CreateNotification = {
  caseId: string
  type: TrackedNotificationType
  recipients: Recipient[]
}

@Injectable()
export class NotificationRepositoryService {
  constructor(
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(notification: CreateNotification): Promise<Notification> {
    const { caseId, type, recipients } = notification

    try {
      this.logger.debug(
        `Creating a ${type} notification for case ${caseId} with ${recipients.length} recipient(s)`,
      )

      return await this.notificationModel.create({ caseId, type, recipients })
    } catch (error) {
      this.logger.error(
        `Error creating a ${type} notification for case ${caseId}:`,
        { error },
      )

      throw error
    }
  }
}
