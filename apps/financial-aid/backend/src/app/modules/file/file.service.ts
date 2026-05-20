import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { S3Service } from '@island.is/nest/aws'

import { CloudFrontService } from './cloudFront.service'
import { ApplicationSystemApiService } from './applicationSystemApi.service'

import { FileType } from '@island.is/financial-aid/shared/lib'

import {
  SignedUrlModel,
  ApplicationFileModel,
  CreateFilesModel,
} from './models'

import { ApplicationModel } from '../application/models/application.model'

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
    private readonly applicationSystemApiService: ApplicationSystemApiService,
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
      include: [{ model: ApplicationModel, attributes: ['applicationSystemId'] }],
    })

    if (!file) {
      throw new Error(`File with id ${id} not found`)
    }

    const applicationSystemId = (file as any).application?.applicationSystemId

    if (applicationSystemId) {
      const url = await this.tryGetPresignedUrlFromApplicationSystem(
        file.key,
        applicationSystemId,
      )
      if (url) {
        return { key: file.key, url }
      }
    }

    const s3Url = await this.tryGetS3PresignedUrl(
      file.key,
      file.applicationId,
      applicationSystemId,
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
      include: [{ model: ApplicationModel, attributes: ['applicationSystemId'] }],
    })

    const applicationSystemId = (allFiles[0] as any)?.application
      ?.applicationSystemId

    let presignedUrlMap: Map<string, string> | null = null
    if (applicationSystemId) {
      presignedUrlMap =
        await this.applicationSystemApiService.getPresignedUrlsForApplication(
          applicationSystemId,
        )
    }

    return await Promise.all(
      allFiles.map(async (file) => {
        if (presignedUrlMap && presignedUrlMap.size > 0) {
          const url = presignedUrlMap.get(file.key)
          if (url) {
            return { key: file.key, url }
          }
        }

        const s3Url = await this.tryGetS3PresignedUrl(
          file.key,
          file.applicationId,
          applicationSystemId,
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

  private async tryGetPresignedUrlFromApplicationSystem(
    fileKey: string,
    applicationSystemId: string,
  ): Promise<string | null> {
    if (!applicationSystemId) {
      return null
    }

    const presignedUrlMap =
      await this.applicationSystemApiService.getPresignedUrlsForApplication(
        applicationSystemId,
      )

    return presignedUrlMap.get(fileKey) ?? null
  }

  private async tryGetS3PresignedUrl(
    fileKey: string,
    applicationId: string,
    applicationSystemId?: string,
  ): Promise<string | null> {
    const bucket = environment.files.applicationAttachmentBucket
    if (!bucket) {
      return null
    }

    const keysToTry = [
      ...(applicationSystemId
        ? [`${applicationSystemId}/${fileKey}`]
        : []),
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
