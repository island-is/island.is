import { Inject, Injectable } from '@nestjs/common'
import {
  ApplicationService,
  Application,
} from '@island.is/application/api/core'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { ApplicationChargeService } from '../charge/application-charge.service'
import { FileService } from '@island.is/application/api/files'
import {
  CreateHnippNotificationDto,
  NotificationsApi,
} from '@island.is/clients/user-notification'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import {
  ApplicationWithAttachments,
  PruningApplication,
} from '@island.is/application/types'

export interface ApplicationPruning {
  pruned: boolean
  application: PruningApplication
  failedAttachments: object
}

@Injectable()
export class ApplicationLifeCycleService {
  private processingApplications: ApplicationPruning[] = []
  private pruneNotifications = new Map<string, CreateHnippNotificationDto>()

  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private applicationService: ApplicationService,
    private fileService: FileService,
    private applicationChargeService: ApplicationChargeService,
    private readonly notificationApi: NotificationsApi,
  ) {
    this.logger = logger.child({ context: 'ApplicationLifeCycleService' })
  }

  public async run() {
    this.logger.info(`Starting application pruning...`)

    await this.fetchApplicationsToBePruned()
    await this.pruneAttachments()
    await this.pruneApplicationCharge()
    await this.pruneApplicationData()
    await this.reportResults()
    this.logger.info(`Application pruning done.`)
  }

  public getProcessingApplications() {
    return this.processingApplications
  }

  private async fetchApplicationsToBePruned() {
    const applications =
      (await this.applicationService.findAllDueToBePruned()) as PruningApplication[]

    this.logger.info(`Found ${applications.length} applications to be pruned.`)

    this.processingApplications = applications.map((application) => {
      return {
        pruned: true,
        application,
        failedAttachments: {},
      }
    })

    for (const { application } of this.processingApplications) {
      const notification = await this.preparePrunedNotification(application)
      if (notification) {
        this.pruneNotifications.set(application.id, notification)
      }
    }
  }

  private async pruneAttachments() {
    for (const prune of this.processingApplications) {
      const result = await this.fileService.deleteAttachmentsForApplication(
        prune.application,
      )
      if (!result.success) {
        prune.pruned = false
        prune.failedAttachments = {
          ...prune.failedAttachments,
          ...result.failed,
        }
      }
    }
  }

  private async pruneApplicationCharge() {
    for (const prune of this.processingApplications) {
      try {
        await this.applicationChargeService.deleteCharge(prune.application)
      } catch (error) {
        prune.pruned = false
        this.logger.error(
          `Application charge prune error on id ${prune.application.id}`,
          error,
        )
      }
    }
  }

  private async pruneApplicationData() {
    for (const prune of this.processingApplications) {
      try {
        const { updatedApplication } = await this.applicationService.update(
          prune.application.id,
          {
            attachments: prune.failedAttachments,
            externalData: {},
            answers: {},
            pruned: prune.pruned,
          },
        )

        prune.application = updatedApplication as PruningApplication
      } catch (error) {
        prune.pruned = false
        this.logger.error(
          `Application data prune error on id ${prune.application.id}`,
          error,
        )
      }
    }
  }

  private async reportResults() {
    const failed = this.processingApplications.filter(
      (application) => !application.pruned,
    )

    const success = this.processingApplications.filter(
      (application) => application.pruned,
    )

    for (const { application } of success) {
      const notification = this.pruneNotifications.get(application.id)
      if (notification) {
        await this.sendPrunedNotification(notification, application.id)
      }
    }

    this.logger.info(`Successful: ${success.length}, Failed: ${failed.length}`)
  }

  private async preparePrunedNotification(
    application: PruningApplication,
  ): Promise<CreateHnippNotificationDto | null> {
    try {
      const template = await getApplicationTemplateByTypeId(application.typeId)
      if (!template) {
        return null
      }
      const stateConfig = template.stateMachineConfig.states[application.state]
      const lifeCycle = stateConfig.meta?.lifecycle
      if (lifeCycle && lifeCycle.shouldBePruned && lifeCycle.pruneMessage) {
        try {
          const pruneMessage =
            typeof lifeCycle.pruneMessage === 'function'
              ? lifeCycle.pruneMessage(
                  application as ApplicationWithAttachments,
                )
              : lifeCycle.pruneMessage
          const notification = {
            recipient: application.applicant,
            templateId: pruneMessage.notificationTemplateId,
            args: [
              {
                key: 'externalBody',
                value: pruneMessage.externalBody || '',
              },
              {
                key: 'internalBody',
                value: pruneMessage.internalBody || '',
              },
            ],
          }
          return notification
        } catch (error) {
          this.logger.error(
            `Failed to prepare pruning notification for application ${application.id}`,
            error,
          )
          return null
        }
      }
      return null
    } catch (error) {
      this.logger.error(
        `Failed to get application template for application typeId ${application.typeId}`,
        error,
      )
      return null
    }
  }

  private async sendPrunedNotification(
    notification: CreateHnippNotificationDto,
    applicationId: string,
  ) {
    try {
      const response =
        await this.notificationApi.notificationsControllerCreateHnippNotification(
          {
            createHnippNotificationDto: notification,
          },
        )
      this.logger.info(
        `Prune notification sent with response: ${JSON.stringify(response)}`,
      )
    } catch (error) {
      this.logger.error(
        `Failed to send pruning notification with error: ${error} for application ${applicationId}`,
      )
    }
  }
}
