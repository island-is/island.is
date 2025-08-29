import { Inject, Injectable } from '@nestjs/common'
import { ApplicationService } from '@island.is/application/api/core'
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
  RecordObject,
} from '@island.is/application/types'
import {
  getAdminDataForPruning,
  getPostPruneAtDate,
} from './application-lifecycle.utils'

export interface ApplicationPruning {
  pruned: boolean
  application: PruningApplication
  failedAttachments: object
}

export interface ApplicationPostPruning {
  postPruned: boolean
  application: PruningApplication
}

@Injectable()
export class ApplicationLifeCycleService {
  private processingApplications: ApplicationPruning[] = []
  private pruneNotifications = new Map<string, CreateHnippNotificationDto>()
  private processingApplicationsPostPruning: ApplicationPostPruning[] = []

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
    // Pruning
    this.logger.info(`Starting application pruning...`)
    await this.fetchApplicationsToBePruned()
    await this.pruneAttachments()
    await this.pruneApplicationCharge()
    await this.pruneApplicationData()
    await this.reportPruningResults()
    this.logger.info(`Application pruning done.`)

    // Post-pruning
    this.logger.info(`Starting application post-pruning...`)
    await this.fetchApplicationsToBePostPruned()
    await this.postPruneApplicationData()
    await this.reportPostPruningResults()
    this.logger.info(`Application post-pruning done.`)
  }

  public getProcessingApplications() {
    return this.processingApplications
  }

  public getProcessingApplicationsPostPruning() {
    return this.processingApplicationsPostPruning
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
        let prunedExternalData: RecordObject = {}
        let prunedAnswers: RecordObject = {}
        let postPruneAt: Date | undefined

        // Check if template has configured admin data to keep fields in answers/externalData after pruning
        // Note: These fields will then be completely pruned in post-prune
        const template = await getApplicationTemplateByTypeId(
          prune.application.typeId,
        )
        if (
          template?.adminDataConfig?.answers ||
          template?.adminDataConfig?.externalData
        ) {
          if (template?.adminDataConfig?.externalData) {
            prunedExternalData = getAdminDataForPruning(
              prune.application.externalData,
              template.adminDataConfig.externalData.map((x) => x.key),
            )
          }
          if (template?.adminDataConfig?.answers) {
            prunedAnswers = getAdminDataForPruning(
              prune.application.answers,
              template.adminDataConfig.answers.map((x) => x.key),
            )
          }

          if (prune.pruned)
            postPruneAt = getPostPruneAtDate(
              template.adminDataConfig.whenToPostPrune,
              prune.application,
            )
        }

        const { updatedApplication } = await this.applicationService.update(
          prune.application.id,
          {
            attachments: prune.failedAttachments,
            externalData: prunedExternalData,
            answers: prunedAnswers,
            pruned: prune.pruned,
            postPruneAt: postPruneAt,
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

  private async reportPruningResults() {
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

  private async fetchApplicationsToBePostPruned() {
    const applications =
      (await this.applicationService.findAllDueToBePostPruned()) as PruningApplication[]

    this.logger.info(
      `Found ${applications.length} applications to be post-pruned.`,
    )

    this.processingApplicationsPostPruning = applications.map((application) => {
      return {
        postPruned: true,
        application,
      }
    })
  }

  private async postPruneApplicationData() {
    for (const prune of this.processingApplicationsPostPruning) {
      try {
        const { updatedApplication } = await this.applicationService.update(
          prune.application.id,
          {
            externalData: {},
            answers: {},
            postPruned: prune.postPruned,
          },
        )

        prune.application = updatedApplication as PruningApplication
      } catch (error) {
        prune.postPruned = false
        this.logger.error(
          `Application data post-prune error on id ${prune.application.id}`,
          error,
        )
      }
    }
  }

  private async reportPostPruningResults() {
    const failed = this.processingApplicationsPostPruning.filter(
      (application) => !application.postPruned,
    )

    const success = this.processingApplicationsPostPruning.filter(
      (application) => application.postPruned,
    )

    this.logger.info(`Successful: ${success.length}, Failed: ${failed.length}`)
  }
}
