import { uuid } from 'uuidv4'

import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { CloudFrontService } from './cloudFront.service'
import { CreatePresignedPostDto } from './dto'
import { PresignedPostModel } from './models'

@Injectable()
export class FileService {
  constructor(
    private readonly cloudFrontService: CloudFrontService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  createCasePresignedPost(
    createPresignedPost: CreatePresignedPostDto,
  ): PresignedPostModel {
    return this.cloudFrontService.createPresignedPost(
      createPresignedPost.fileName,
    )
  }
}
