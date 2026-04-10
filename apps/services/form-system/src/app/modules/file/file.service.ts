import { FileStorageService } from '@island.is/file-storage'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { S3Service } from '@island.is/nest/aws'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { InjectModel } from '@nestjs/sequelize'
import { Value } from '../applications/models/value.model'
import { FileConfig } from './file.config'
import { Sequelize } from 'sequelize-typescript'
import { Transaction } from 'sequelize'

@Injectable()
export class FileService {
  constructor(
    @Inject(FileConfig.KEY)
    private readonly config: ConfigType<typeof FileConfig>,
    private readonly s3Service: S3Service,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly fileStorageService: FileStorageService,
    @InjectModel(Value)
    private readonly valueModel: typeof Value,
    private readonly sequelize: Sequelize,
  ) {}

  async fileExists(key: string): Promise<boolean> {
    return await this.fileStorageService.fileExists(key)
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

    let attempts = 0

    while (attempts < 5) {
      const exists = await this.fileExists(sourceKey)
      this.logger.info(`Starting attempt ${attempts + 1}`)
      if (exists) {
        try {
          await this.sequelize.transaction(async (transaction) => {
            const value = await this.valueModel.findByPk(valueId, {
              transaction,
              lock: transaction.LOCK.UPDATE, // row-level lock
            })

            if (!value) {
              throw new Error(`Value with PK: ${valueId} not found`)
            }

            const applicationId = value.applicationId
            const key = `${applicationId}/${sourceKey}`

            const res =
              await this.fileStorageService.copyObjectFromUploadBucket(
                sourceKey,
                targetBucket,
                key,
              )
            this.logger.info(`result: ${res}`)

            const existingKeys = value.json?.s3Key
            const currentKeys = Array.isArray(existingKeys) ? existingKeys : []

            // avoid duplicates on retries
            const updatedKeys = currentKeys.includes(key)
              ? currentKeys
              : [...currentKeys, key]

            value.json = {
              ...(value.json ?? {}),
              s3Key: updatedKeys,
            }

            await value.save({ transaction })

            this.logger.info(
              `✅ Updated field ${fieldId} with new S3 key ${key}`,
            )
          })

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

  async getFile(key: string): Promise<string | undefined> {
    if (!key) {
      throw new Error('Key and valueId must be provided for fetching file')
    }

    const bucket = this.config.bucket
    if (!bucket) {
      throw new Error('S3 bucket not configured')
    }

    // const s3Uri = `s3://${bucket}/${key}`

    this.logger.info(`Fetching file ${key}`)

    try {
      const fileContent = await this.s3Service.getFileContent(
        { bucket, key },
        'base64',
      )
      return fileContent
    } catch (error) {
      this.logger.error(`Error fetching fileContent ${key}`, error)
      return undefined
    }
  }

  async deleteFile(
    key: string,
    valueId: string,
    transaction?: Transaction,
  ): Promise<void> {
    if (!key || !valueId) {
      throw new Error('Key and valueId must be provided for deletion')
    }

    const bucket = this.config.bucket
    if (!bucket) {
      throw new Error('S3 bucket not configured')
    }

    this.logger.info(`Deleting file ${key} for valueId ${valueId}`)

    try {
      await this.s3Service.deleteObject({ bucket, key })
      this.logger.info(`Successfully deleted file ${key}`)

      // Update the Value to remove the S3 key reference
      const value = await this.valueModel.findByPk(valueId, { transaction })
      if (value) {
        value.json = {
          ...value.json,
          s3Key: value.json?.s3Key?.filter((k: string) => k !== key) || [],
        }

        if (transaction) await value.save({ transaction })
        else await value.save()

        this.logger.info(`Cleared s3Key for valueId ${valueId} after deletion`)
      } else {
        this.logger.warn(`Value with id ${valueId} not found`)
      }
    } catch (error) {
      this.logger.error(`Error deleting file ${key}`, error)
      throw error
    }
  }
}
