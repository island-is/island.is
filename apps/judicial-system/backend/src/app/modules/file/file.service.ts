import { Inject, Injectable } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { CreatePresignedPostDto } from './dto'
import { PresignedPost } from './models'

@Injectable()
export class FileService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async createPresignedPost(
    caseId: string,
    createPresignedPost: CreatePresignedPostDto,
  ): Promise<PresignedPost> {
    return {
      url: 'bla',
    }
  }
}
