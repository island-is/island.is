import { Inject, Injectable } from '@nestjs/common'
import {
  ApplicationService,
  Application,
} from '@island.is/application/api/core'
import { AwsService } from '@island.is/nest/aws'
import AmazonS3URI from 'amazon-s3-uri'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { ApplicationChargeService } from '../charge/application-charge.service'

export interface AttachmentMetaData {
  s3key: string
  key: string
  bucket: string
  value: string
}

export interface ApplicationPruning {
  pruned: boolean
  application: Pick<
    Application,
    'id' | 'attachments' | 'answers' | 'externalData'
  >
  failedAttachments: object
  failedExternalData: object
}

@Injectable()
export class ApplicationLifeCycleService {
  private processingApplications: ApplicationPruning[] = []

  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private applicationService: ApplicationService,
    private awsService: AwsService,
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
        failedExternalData: {},
      }
    })
  }

  private async pruneAttachments() {
    for (const prune of this.processingApplications) {
      const applicationAttachments = prune.application.attachments as {
        key: string
        name: string
      }

      const attachments = this.attachmentsToMetaDataArray(
        applicationAttachments,
      )

      if (attachments) {
        for (const attachment of attachments) {
          const { key, s3key, bucket, value } = attachment
          try {
            this.logger.info(
              `Deleting attachment ${s3key} from bucket ${bucket}`,
            )
            await this.awsService.deleteObject(bucket, s3key)
          } catch (error) {
            prune.pruned = false
            prune.failedAttachments = {
              ...prune.failedAttachments,
              [key]: value,
            }
            this.logger.error(
              `S3 object delete failed for application Id: ${prune.application.id} and attachment key: ${key}`,
              error,
            )
          }
        }
      }
    }
  }

  private async pruneApplicationCharge() {
    for (const prune of this.processingApplications) {
      try {
        await this.applicationChargeService.deleteCharge(prune.application)
      } catch (error) {
        const chargeId = this.applicationChargeService.getChargeId(
          prune.application,
        )
        if (chargeId) {
          prune.failedExternalData = {
            createCharge: {
              data: {
                id: chargeId,
              },
            },
          }
        }

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
            externalData: prune.failedExternalData,
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

  private attachmentsToMetaDataArray(
    attachments: object,
  ): AttachmentMetaData[] {
    const keys: AttachmentMetaData[] = []
    for (const [key, value] of Object.entries(attachments)) {
      const { key: sourceKey, bucket } = AmazonS3URI(value)
      keys.push({ key, s3key: sourceKey, bucket, value })
    }

    return keys
  }
}
