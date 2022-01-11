import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common'
import {
  ApplicationConfig,
  APPLICATION_CONFIG,
} from '../application.configuration'
import { Application } from '../application.model'
import { ApplicationService } from '../application.service'
import { AwsService } from '../files'
import AmazonS3URI from 'amazon-s3-uri'

export interface ApplicationPruningProcess {
  // TODO better name
  id: string
  pruneSuccess: boolean
  messages: string[]
  application: Application
  failedAttachments: object
}

export enum ApplicationPruningProcessStatus {
  Failed = 'failed',
  Success = 'Success',
  AttachmentFailure = 'attachment-failure',
}

@Injectable()
export class ApplicationLifeCycleService implements OnApplicationShutdown {
  //TODO better name
  private processingApplications: ApplicationPruningProcess[] = []

  constructor(
    @Inject(APPLICATION_CONFIG)
    private readonly config: ApplicationConfig,
    private applicationService: ApplicationService,
    private awsService: AwsService,
  ) {}

  onApplicationShutdown(signal?: string) {
    console.log('shutdown...', signal)
  }

  onModuleDestroy() {
    console.log('destroyed...')
  }

  /**
   * Step 1:
   * - get all applications from the database to be pruned
   * Step 2:
   * - prune the applications answers and external data
   * Step 3:
   * - collect attachment keys to be pruned
   * Step 4:
   * - delete/remove said attachemnts from S3
   * Step 4:
   * - prune the attachments from the applications
   * Step 5:
   * - validate that should be pruned is pruned.
   * Step 6:
   * - mark the applications as pruned??
   * Step 7:
   * - report results
   */
  public async run() {
    console.log('running...')
    //const toBePruned = await this.applicationService.findAllDueToBePruned()
    await this.fetchApplicationsToBePruned()
    //await this.getJustOneById('c21b4710-1932-4b23-a960-5f1c9c15b9b8')
    await this.pruneAttachments()
    await this.pruneAnswersAndData()
    this.reportResults()
  }

  public getProcessingApplications() {
    return this.processingApplications
  }

  private async getJustOneById(id: string) {
    const application = await this.applicationService.findOneById(id)
    if (application) {
      this.processingApplications.push({
        id: application.id,
        pruneSuccess: false,
        messages: [],
        application,
        failedAttachments: {},
      })
    }
  }

  private async fetchApplicationsToBePruned() {
    console.log('get...')
    const applications = await this.applicationService.findAllDueToBePruned()
    console.log({ applications })
    this.processingApplications = applications.map((application) => {
      return {
        id: application.id,
        pruneSuccess: false,
        messages: [],
        application,
        failedAttachments: {},
      }
    })
  }

  private async pruneAnswersAndData() {
    console.log('pruneAnswers...')
    for (const prune of this.processingApplications) {
      try {
        const { updatedApplication } = await this.applicationService.update(
          prune.id,
          {
            attachments: prune.failedAttachments,
            externalData: {},
            answers: {},
          },
        )

        console.log({ updatedApplication })

        prune.pruneSuccess = true
        prune.application = updatedApplication
      } catch (e) {
        console.log(e)
        prune.pruneSuccess = false
        prune.messages.push(`Answers And data error : ${e.message}`)
      }
    }
  }

  private async pruneAttachments() {
    console.log('pruneAttachments...')
    for (const prune of this.processingApplications) {
      try {
        const applicationAttachments = prune.application.attachments as {
          key: string
          name: string
        }

        const attachments = this.attachmentsToKeyArray(applicationAttachments)

        if (attachments) {
          //delete attachments
          await this.awsService.deleteObjects(this.getBucketName(), attachments)

          //Verify if all attachments were deleted
          for (const [key, value] of Object.entries(applicationAttachments)) {
            const exists = await this.awsService.fileExists(
              this.getBucketName(),
              value,
            )
            if (exists) {
              prune.messages.push(`Failed to delete attachment of ${value}`)
              prune.failedAttachments = {
                ...prune.failedAttachments,
                [key]: value,
              }
            }
          }
        }

        prune.pruneSuccess = true
      } catch (e) {
        prune.pruneSuccess = false
        prune.messages.push(`S3 delete error : ${e.message}`)
      }
    }
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

  private reportResults() {
    console.log('reportResults...')
    console.log(JSON.stringify(this.processingApplications, null, 2))
  }

  private getBucketName() {
    const bucket = this.config.attachmentBucket

    if (!bucket) {
      // throw new Error('Unable to get bucket name from config.')
      return 'buekt'
    }

    return bucket
  }
}
