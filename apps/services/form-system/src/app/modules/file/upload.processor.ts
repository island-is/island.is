import { FileStorageService } from '@island.is/file-storage'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Process, Processor } from '@nestjs/bull'
import { Inject } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Job } from 'bull'
import { FieldsService } from '../fields/fields.service'
import { FileConfig } from './file.config'

interface JobData {
  fieldId: string
  key: string
}

interface JobResult {
  key: string
  url: string
}

@Processor('upload')
@CodeOwner(CodeOwners.Advania)
export class UploadProcessor {
  constructor(
    private readonly fieldsService: FieldsService,
    private readonly fileStorageService: FileStorageService,
    @Inject(FileConfig.KEY)
    private config: ConfigType<typeof FileConfig>,
    @Inject(LOGGER_PROVIDER) protected readonly logger: Logger,
  ) {}

  @Process('upload')
  async handleUpload(job: Job<JobData>) {
    const { fieldId, key } = job.data
    const destinationBucket = this.config.bucket

    this.logger.info(`🟢 UploadProcessor started for ${key}`)
    this.logger.info(`Destination bucket: ${destinationBucket}`)

    const maxRetries = 3
    const delay = 5000
    let attempt = 0

    if (!destinationBucket) {
      this.logger.error('❌ No destination bucket configured')
      return
    }

    while (attempt < maxRetries) {
      this.logger.info(
        `Attempt ${attempt + 1}: checking if ${key} exists in upload bucket`,
      )
      const exists = await this.fileStorageService.fileExists(key)
      this.logger.info(`Exists: ${exists}`)

      if (exists) {
        this.logger.info(
          `Copying ${key} → ${destinationBucket}/${fieldId}/${key}`,
        )
        try {
          await this.fileStorageService.copyObjectFromUploadBucket(
            key,
            destinationBucket,
            `${fieldId}/${key}`,
          )
          this.logger.info(`✅ Successfully copied ${key}`)
          return
        } catch (error) {
          this.logger.error(`❌ Copy failed: ${error}`)
          throw error
        }
      }

      this.logger.warn(`File not found yet; retrying in ${delay / 1000}s`)
      await new Promise((r) => setTimeout(r, delay))
      attempt++
    }

    this.logger.error(`❌ Failed to copy ${key} after ${maxRetries} attempts`)
  }
}
