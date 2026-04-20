import { FileStorageService } from '@island.is/file-storage'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Process, Processor } from '@nestjs/bull'
import { Inject } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { InjectModel } from '@nestjs/sequelize'
import { Job } from 'bull'
import { Value } from '../applications/models/value.model'
import { FileConfig } from './file.config'

interface JobData {
  fieldId: string
  key: string
  valueId: string
}

@Processor('upload')
@CodeOwner(CodeOwners.Advania)
export class UploadProcessor {
  constructor(
    @InjectModel(Value)
    private readonly valueModel: typeof Value,
    private readonly fileStorageService: FileStorageService,
    @Inject(FileConfig.KEY)
    private config: ConfigType<typeof FileConfig>,
    @Inject(LOGGER_PROVIDER) protected readonly logger: Logger,
  ) {}

  @Process('upload')
  async handleUpload(job: Job<JobData>) {
    const { fieldId, key, valueId } = job.data
    const destinationBucket = this.config.bucket

    this.logger.info(`UploadProcessor started for ${key}`)
    this.logger.info(`Destination bucket: ${destinationBucket}`)

    const maxRetries = 3
    const delay = 5000
    let attempt = 0

    if (!destinationBucket) {
      this.logger.error('No destination bucket configured')
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
          const newKey = `${fieldId}/${key}`
          await this.fileStorageService.copyObjectFromUploadBucket(
            key,
            destinationBucket,
            newKey,
          )
          this.logger.info(`✅ Successfully copied ${key}`)

          // Update the field with the new S3 key
          const value = await this.valueModel.findByPk(valueId)

          if (!value) {
            this.logger.warn(`Value with PK: ${valueId} not found`)
            return
          }

          const currentKeys = value.json?.s3Key || []
          const updatedKeys = [...currentKeys, newKey]

          value.json = {
            ...value.json,
            s3Key: updatedKeys,
          }

          await value.save()

          this.logger.info(
            `✅ Updated field ${fieldId} with new S3 key ${newKey}`,
          )
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

    throw new Error(`Failed to copy ${key} after ${maxRetries} attempts`)
  }
}
