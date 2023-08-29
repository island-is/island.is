import { Inject, Injectable } from '@nestjs/common'
import {
  ApplicationService,
  Application,
} from '@island.is/application/api/core'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { ApplicationChargeService } from '../charge/application-charge.service'
import { FileService } from '@island.is/application/api/files'

export interface ApplicationPruning {
  pruned: boolean
  application: Pick<
    Application,
    'id' | 'attachments' | 'answers' | 'externalData' | 'typeId' | 'state'
  >
  failedAttachments: object
}

@Injectable()
export class ApplicationLifeCycleService {
  private processingApplications: ApplicationPruning[] = []

  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private applicationService: ApplicationService,
    private fileService: FileService,
    private applicationChargeService: ApplicationChargeService,
  ) {
    this.logger = logger.child({ context: 'ApplicationLifeCycleService' })
  }

  public async run() {
    this.logger.info(`Starting application pruning...`)
    await this.fetchApplicationsToBePruned()
    await this.pruneAttachments()
    await this.pruneApplicationCharge()
    await this.pruneApplicationData()
    this.reportResults()
    this.logger.info(`Application pruning done.`)
  }

  public getProcessingApplications() {
    return this.processingApplications
  }

  private async fetchApplicationsToBePruned() {
    const applications =
      (await this.applicationService.findAllDueToBePruned()) as Pick<
        Application,
        'id' | 'attachments' | 'answers' | 'externalData' | 'typeId' | 'state'
      >[]

    this.logger.info(`Found ${applications.length} applications to be pruned.`)

    this.processingApplications = applications.map((application) => {
      return {
        pruned: true,
        application,
        failedAttachments: {},
      }
    })
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

        prune.application = updatedApplication
      } catch (error) {
        prune.pruned = false
        this.logger.error(
          `Application data prune error on id ${prune.application.id}`,
          error,
        )
      }
    }
  }

  private reportResults() {
    const failed = this.processingApplications.filter(
      (application) => !application.pruned,
    )

    const success = this.processingApplications.filter(
      (application) => application.pruned,
    )

    this.logger.info(`Successful: ${success.length}, Failed: ${failed.length}`)
  }
}
