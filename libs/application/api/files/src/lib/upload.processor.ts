import { OnQueueCompleted, Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { ApplicationService } from '@island.is/application/api/core'
import { FileStorageService } from '@island.is/file-storage'
import { Inject } from '@nestjs/common'
import AmazonS3URI from 'amazon-s3-uri'
import { ApplicationFilesConfig } from './files.config'
import { ConfigType } from '@nestjs/config'
import {
  LOGGER_PROVIDER,
  withLoggingContext,
  type Logger,
} from '@island.is/logging'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'

interface JobData {
  applicationId: string
  nationalId: string
  attachmentUrl: string
}

interface JobResult {
  attachmentKey: string
  resultUrl: string
}

@Processor('upload')
@CodeOwner(CodeOwners.NordaApplications)
export class UploadProcessor {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly fileStorageService: FileStorageService,
    @Inject(ApplicationFilesConfig.KEY)
    private config: ConfigType<typeof ApplicationFilesConfig>,
    @Inject(LOGGER_PROVIDER) protected readonly logger: Logger,
  ) {}

  @Process('upload')
  async handleUpload(job: Job<JobData>): Promise<JobResult> {
    const { attachmentUrl, applicationId } = job.data
    const destinationBucket = this.config.attachmentBucket

    if (!destinationBucket) {
      throw new Error('Application attachment bucket not configured.')
    }

    const { key: sourceKey } = AmazonS3URI(attachmentUrl)
    const destinationKey = `${applicationId}/${sourceKey}`

    // Add file existence check before copy
    try {
      const fileExists = await this.fileStorageService.fileExists(sourceKey)

      if (!fileExists) {
        throw new Error(`Source file ${sourceKey} not found in upload bucket`)
      }

      const resultUrl =
        await this.fileStorageService.copyObjectFromUploadBucket(
          sourceKey,
          destinationBucket,
          destinationKey,
        )

      return {
        attachmentKey: sourceKey,
        resultUrl,
      }
    } catch (error) {
      withLoggingContext({ applicationId: applicationId }, () => {
        this.logger.error(
          'An error occurred while processing copy job on upload',
          error,
        )
      })
      throw error
    }
  }

  @OnQueueCompleted()
  async onCompleted(job: Job, result: JobResult) {
    const { applicationId, nationalId }: JobData = job.data
    try {
      const existingApplication = await this.applicationService.findOneById(
        applicationId,
        nationalId,
      )

      // If the application exists
      // And the attachments object doesnt have a property with the given key
      // Dont update it with the new storage s3 url (because it doesnt exist)
      if (
        existingApplication &&
        !Object.prototype.hasOwnProperty.call(
          existingApplication.attachments,
          result.attachmentKey,
        )
      ) {
        return
      }

      return await this.applicationService.updateAttachment(
        applicationId,
        nationalId,
        result.attachmentKey,
        result.resultUrl,
      )
    } catch (error) {
      withLoggingContext(
        {
          applicationId: applicationId,
        },
        () => {
          this.logger.error(
            'An error occurred while completing upload job',
            error,
          )
        },
      )
      throw error
    }
  }
}
