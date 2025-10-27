import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { S3Service } from '@island.is/nest/aws'
import { InjectQueue } from '@nestjs/bull'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Queue } from 'bull'
import { FileConfig } from './file.config'

const TEMP_BUCKET = 'island-is-dev-upload-api'

@Injectable()
export class FileService {
  constructor(
    @Inject(FileConfig.KEY)
    private readonly config: ConfigType<typeof FileConfig>,
    private readonly s3Service: S3Service,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @InjectQueue('upload') private readonly uploadQueue: Queue,
  ) {}

  async fileExists(key: string): Promise<boolean> {
    try {
      const s3Uri = `s3://${TEMP_BUCKET}/${key}`
      return await this.s3Service.fileExists(s3Uri)
    } catch (error) {
      this.logger.error(`Error checking existence for ${key}`, error)
      return false
    }
  }

  /**
   * Queues a background job to copy a file from the temp bucket to the permanent bucket.
   * The UploadProcessor will handle retries and S3 copy when the upload finishes.
   */
  async uploadFile(fieldId: string, sourceKey: string): Promise<void> {
    const targetBucket = this.config.bucket
    if (!targetBucket) {
      throw new Error('Target S3 bucket not configured')
    }

    this.logger.info(
      `Queueing copy job for file ${sourceKey} from ${TEMP_BUCKET} to ${targetBucket}`,
    )

    await this.uploadQueue.add('upload', {
      fieldId,
      key: sourceKey,
    })

    this.logger.info(`Upload job added to queue for key ${sourceKey}`)
  }
}
