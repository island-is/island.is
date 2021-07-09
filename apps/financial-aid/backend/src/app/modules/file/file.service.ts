import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { CloudFrontService } from './cloudFront.service'

import { SignedUrlModel, ApplicationFileModel } from './models'

import { environment } from '../../../environments'
import { CreateFileDto } from './dto'

@Injectable()
export class FileService {
  constructor(
    @InjectModel(ApplicationFileModel)
    private readonly fileModel: typeof ApplicationFileModel,
    private readonly cloudFrontService: CloudFrontService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  createFile(createFile: CreateFileDto): Promise<ApplicationFileModel> {
    // this.logger.debug('Creating a new application event')
    return this.fileModel.create(createFile)
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
