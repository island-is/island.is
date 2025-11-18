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
      throw new Error('Target S3 bucket not configured')
    }

    this.logger.info(
      `Queueing copy job for file ${sourceKey} from ${this.config.tempBucket} to ${targetBucket}`,
    )

    await this.uploadQueue.add('upload', {
      fieldId,
      key: sourceKey,
      valueId,
    })

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
