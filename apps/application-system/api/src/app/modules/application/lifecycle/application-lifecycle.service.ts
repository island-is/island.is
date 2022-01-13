import { Inject, Injectable } from '@nestjs/common'
import { APPLICATION_CONFIG } from '../application.configuration'
import type { ApplicationConfig } from '../application.configuration'
import { Application } from '../application.model'
import { ApplicationService } from '../application.service'
import { AwsService } from '../files'
import AmazonS3URI from 'amazon-s3-uri'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

export interface ApplicationPruning {
  pruned: boolean
  application: Pick<
    Application,
    'id' | 'attachments' | 'answers' | 'externalData'
  >
  failedAttachments: object
}

@Injectable()
export class ApplicationLifeCycleService {
  private processingApplications: ApplicationPruning[] = []

  constructor(
    @Inject(APPLICATION_CONFIG)
    private readonly config: ApplicationConfig,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private applicationService: ApplicationService,
    private awsService: AwsService,
  ) {
    this.logger = logger.child({ context: 'ApplicationLifeCycleService' })
  }

  public async run() {
    this.logger.info(`Starting application pruning...`)
    await this.fetchApplicationsToBePruned()
    await this.pruneAttachments()
    await this.pruneApplicationData()
    this.reportResults()
    this.logger.info(`Application pruning done.`)
  }

  public getProcessingApplications() {
    return this.processingApplications
  }

  private async fetchApplicationsToBePruned() {
    const applications = (await this.applicationService.findAllDueToBePruned()) as Pick<
      Application,
      'id' | 'attachments' | 'answers' | 'externalData'
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
      const applicationAttachments = prune.application.attachments as {
        key: string
        name: string
      }

      const attachments = this.attachmentsToKeyArray(applicationAttachments)
      try {
        if (attachments) {
          await this.awsService.deleteObjects(this.getBucketName(), attachments)
        }
      } catch (error) {
        prune.pruned = false
        this.logger.error(
          `Failed to delete objects from S3 for application id  ${prune.application.id}`,
          error,
        )
      }

      //Verify if all attachments were deleted
      for (const [key, value] of Object.entries(applicationAttachments)) {
        const exists = await this.awsService.fileExists(
          this.getBucketName(),
          value,
        )
        if (exists) {
          prune.pruned = false
          prune.failedAttachments = {
            ...prune.failedAttachments,
            [key]: value,
          }
          this.logger.error(
            `Attachment ${key}:${value} was not deleted for application id  ${prune.application.id}`,
          )
        }
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
            pruned: true,
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

    this.logger.info(`Successful: ${success.length}`)
    this.logger.info(`Failed: ${failed.length}`)
  }

  private attachmentsToKeyArray(
    attachments: object,
  ): {
    Key: string
  }[] {
    const keys: { Key: string }[] = []
    for (const [key, value] of Object.entries(attachments)) {
      const { key: sourceKey } = AmazonS3URI(value)
      keys.push({ Key: sourceKey })
    }

    return keys
  }

  private getBucketName() {
    const bucket = this.config.attachmentBucket

    if (!bucket) {
      throw new Error('Unable to get bucket name from config.')
    }

    return bucket
  }
}
