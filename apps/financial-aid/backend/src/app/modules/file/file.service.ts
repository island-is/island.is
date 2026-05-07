import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { S3Service } from '@island.is/nest/aws'

import { CloudFrontService } from './cloudFront.service'

import { FileType } from '@island.is/financial-aid/shared/lib'

import {
  SignedUrlModel,
  ApplicationFileModel,
  CreateFilesModel,
} from './models'

import { environment } from '../../../environments'
import { CreateFileDto } from './dto'
import { CreateFilesDto } from './dto/createFiles.dto'

const downloadExpirationSeconds =
  environment.files.getTimeToLiveMinutes * 60

@Injectable()
export class FileService {
  constructor(
    @InjectModel(ApplicationFileModel)
    private readonly fileModel: typeof ApplicationFileModel,
    private readonly cloudFrontService: CloudFrontService,
    private readonly s3Service: S3Service,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async createFile(createFile: CreateFileDto): Promise<ApplicationFileModel> {
    return this.fileModel.create(createFile)
  }

  async createFiles(createFiles: CreateFilesDto): Promise<CreateFilesModel> {
    const promises = createFiles.files.map((file) =>
      this.fileModel.create({
        applicationId: file.applicationId,
        name: file.name,
        key: file.key,
        size: file.size,
        type: file.type,
      }),
    )
    return await Promise.all(promises)
      .then((values) => {
        return {
          files: values,
          success: true,
        } as CreateFilesModel
      })
      .catch(() => {
        return {
          files: [],
          success: false,
        } as CreateFilesModel
      })
  }

  async getAllApplicationFiles(
    applicationId: string,
  ): Promise<ApplicationFileModel[]> {
    this.logger.debug(`Getting all files for case ${applicationId}`)
    return this.fileModel.findAll({
      where: { applicationId },
      order: [['created', 'DESC']],
    })
  }

  async getApplicationFilesByType(
    applicationId: string,
    fileType: FileType,
  ): Promise<ApplicationFileModel> {
    this.logger.debug(
      `Checking if application-${applicationId} has certain file type `,
    )

    return this.fileModel.findOne({
      where: { applicationId, type: fileType },
    })
  }

  async createSignedUrl(
    folder: string,
    fileName: string,
  ): Promise<SignedUrlModel> {
    const bucket = environment.files.applicationAttachmentBucket
    const key = `${folder}/${fileName}`
    const uploadExpirationSeconds =
      environment.files.postTimeToLiveMinutes * 60

    const url = await this.s3Service.getPresignedUploadUrl(
      { bucket, key },
      uploadExpirationSeconds,
    )

    return { key, url }
  }

  async createSignedUrlForFileId(id: string): Promise<SignedUrlModel> {
    const file = await this.fileModel.findOne({
      where: { id },
    })

    const s3Url = await this.tryGetS3PresignedUrl(
      file.key,
      file.applicationId,
    )
    if (s3Url) {
      return { key: file.key, url: s3Url }
    }

    const fileUrl = `${environment.files.fileBaseUrl}/${file.key}`
    const signedUrl = this.cloudFrontService.createPresignedPost(fileUrl)
    return { key: file.key, url: signedUrl }
  }

  async createSignedUrlForAllFilesId(
    applicationId: string,
  ): Promise<SignedUrlModel[]> {
    const allFiles = await this.fileModel.findAll({
      where: { applicationId },
    })

    return await Promise.all(
      allFiles.map(async (file) => {
        const s3Url = await this.tryGetS3PresignedUrl(
          file.key,
          file.applicationId,
        )
        if (s3Url) {
          return { key: file.key, url: s3Url }
        }

        const fileUrl = `${environment.files.fileBaseUrl}/${file.key}`
        const signedUrl = this.cloudFrontService.createPresignedPost(fileUrl)
        return { key: file.key, url: signedUrl }
      }),
    )
  }

  private async tryGetS3PresignedUrl(
    fileKey: string,
    applicationId: string,
  ): Promise<string | null> {
    const bucket = environment.files.applicationAttachmentBucket
    if (!bucket) {
      return null
    }

    // New files from buildFileUploadField have key = "{uuid}_{name}.{ext}"
    // and are stored in S3 at "{applicationId}/{key}".
    // Old CloudFront files have key = "{applicationId}/{filename}"
    // and are not in the application-system S3 bucket.
    const keysToTry = [
      `${applicationId}/${fileKey}`,
      fileKey,
    ]

    for (const key of keysToTry) {
      try {
        const exists = await this.s3Service.fileExists({ bucket, key })
        if (exists) {
          return await this.s3Service.getPresignedUrl(
            { bucket, key },
            downloadExpirationSeconds,
          )
        }
      } catch {
        // Continue to next key pattern
      }
    }

    this.logger.debug(
      `File ${fileKey} not found in S3 bucket ${bucket}, falling back to CloudFront`,
    )
    return null
  }
}
