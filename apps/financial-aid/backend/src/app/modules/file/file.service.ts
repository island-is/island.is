import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { CloudFrontService } from './cloudFront.service'

import {
  SignedUrlModel,
  ApplicationFileModel,
  CreateFilesModel,
} from './models'

import { environment } from '../../../environments'
import { CreateFileDto } from './dto'
import { CreateFilesDto } from './dto/createFiles.dto'

@Injectable()
export class FileService {
  constructor(
    @InjectModel(ApplicationFileModel)
    private readonly fileModel: typeof ApplicationFileModel,
    private readonly cloudFrontService: CloudFrontService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async createFile(createFile: CreateFileDto): Promise<ApplicationFileModel> {
    return await this.fileModel.create(createFile)
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
      .then(() => {
        return {
          success: true,
        }
      })
      .catch(() => {
        return {
          success: false,
        }
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

  createSignedUrl(folder: string, fileName: string): SignedUrlModel {
    const key = `${folder}/${fileName}`

    const fileUrl = `${environment.files.fileBaseUrl}/${key}`

    const signedUrl = this.cloudFrontService.createPresignedPost(fileUrl)

    return {
      key,
      url: signedUrl,
    }
  }
}
