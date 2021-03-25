import { uuid } from 'uuidv4'

import { Inject, Injectable } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { AwsS3Service } from './awsS3.service'
import { CreatePresignedPostDto } from './dto'
import { PresignedPost } from './models'

@Injectable()
export class FileService {
  constructor(
    private readonly awsS3Service: AwsS3Service,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  createPresignedPost(
    caseId: string,
    createPresignedPost: CreatePresignedPostDto,
  ): Promise<PresignedPost> {
    return this.awsS3Service.createPresignedPost(
      `${caseId}/${uuid()}_${createPresignedPost.fileName}`,
    )
  }
}
