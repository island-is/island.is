import { FileStorageService } from '@island.is/file-storage'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { S3Service } from '@island.is/nest/aws'
import { InjectQueue } from '@nestjs/bull'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { InjectModel } from '@nestjs/sequelize'
import { Queue } from 'bull'
import { Value } from '../applications/models/value.model'
import { FileConfig } from './file.config'

@Injectable()
export class FileService {
  constructor(
    @Inject(FileConfig.KEY)
    private readonly config: ConfigType<typeof FileConfig>,
    private readonly s3Service: S3Service,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @InjectQueue('upload') private readonly uploadQueue: Queue,
    private readonly fileStorageService: FileStorageService,
    @InjectModel(Value)
    private readonly valueModel: typeof Value,
  ) {}

  async fileExists(key: string): Promise<boolean> {
    try {
      const s3Uri = `s3://${this.config.tempBucket}/${key}`
      return await this.s3Service.fileExists(s3Uri)
    } catch (error) {
      this.logger.error(`Error checking existence for ${key}`, error)
      return false
    }
  }

  async uploadFile(
    fieldId: string,
    sourceKey: string,
    valueId: string,
  ): Promise<void> {
    const targetBucket = this.config.bucket
    if (!targetBucket) {
      this.logger.error('❌ No destination bucket configured')
      return
    }

    this.logger.info(
      `Queueing copy job for file ${sourceKey} from ${this.config.tempBucket} to ${targetBucket}`,
    )

    //   try {
    //     await Promise.race([
    //       this.uploadQueue.add('upload', { fieldId, key: sourceKey, valueId }),
    //       new Promise((_, reject) =>
    //         setTimeout(
    //           () => reject(new Error('Timed out adding job to upload queue')),
    //           5000,
    //         ),
    //       ),
    //     ])
    //     this.logger.info('✅ Job added to upload queue')
    //   } catch (e) {
    //     this.logger.error('❌ Failed to add job to upload queue', e)
    //     throw e
    //   }
    // }

    let attempts = 0
    const key = `${fieldId}/${sourceKey}`

    while (attempts < 5) {
      const exists = await this.fileExists(sourceKey)
      this.logger.info(`Starting attempt ${attempts + 1}`)
      if (exists) {
        try {
          const res = await this.fileStorageService.copyObjectFromUploadBucket(
            sourceKey,
            targetBucket,
            key,
          )
          this.logger.info(`result: ${res}`)
          const value = await this.valueModel.findByPk(valueId)

          if (!value) {
            this.logger.warn(`Value with PK: ${valueId} not found`)
            return
          }

          const currentKeys = value.json?.s3Key || []
          const updatedKeys = [...currentKeys, key]

          value.json = {
            ...value.json,
            s3Key: updatedKeys,
          }

          await value.save()

          this.logger.info(`✅ Updated field ${fieldId} with new S3 key ${key}`)
          return
        } catch (error) {
          this.logger.error(`❌ Copy failed: ${error}`)
          throw error
        }
      }

      attempts++
      if (!exists) {
        this.logger.warn(
          `File ${sourceKey} not found in upload bucket. Retrying in 2 seconds...`,
        )
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    this.logger.info(`Upload job added to queue for key ${sourceKey}`)
  }

  async deleteFile(key: string, valueId: string): Promise<void> {
    if (!key || !valueId) {
      throw new Error('Key and valueId must be provided for deletion')
    }

    const bucket = this.config.bucket
    if (!bucket) {
      throw new Error('S3 bucket not configured')
    }

    const s3Uri = `s3://${bucket}/${key}`

    this.logger.info(`Deleting file ${s3Uri} for valueId ${valueId}`)

    try {
      await this.s3Service.deleteObject({ bucket, key })
      this.logger.info(`Successfully deleted file ${s3Uri}`)

      // Update the Value to remove the S3 key reference
      const value = await this.valueModel.findByPk(valueId)
      if (value) {
        value.json = {
          ...value.json,
          s3Key: value.json?.s3Key?.filter((k: string) => k !== key) || [],
        }
        await value.save()
        this.logger.info(`Cleared s3Key for valueId ${valueId} after deletion`)
      } else {
        this.logger.warn(`Value with id ${valueId} not found`)
      }
    } catch (error) {
      this.logger.error(`Error deleting file ${s3Uri}`, error)
      throw error
    }
  }
}
