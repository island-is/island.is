import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { CloudFrontService } from './cloudFront.service'

import { SignedUrlModel } from './models'

import { environment } from '../../../environments'

@Injectable()
export class FileService {
  constructor(
    private readonly cloudFrontService: CloudFrontService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  createSignedUrl(folder: string, fileName: string): SignedUrlModel {
    const fileUrl = `${environment.files.fileBaseUrl}${folder}/${fileName}`

    return this.cloudFrontService.createPresignedPost(fileUrl)
  }
}
