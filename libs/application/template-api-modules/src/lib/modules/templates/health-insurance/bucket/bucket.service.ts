import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { AwsService } from '@island.is/nest/aws'

@Injectable()
export class BucketService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private aws: AwsService,
  ) {}

  async getFileContentAsBase64(filename: string): Promise<string> {
    this.logger.info('Getting file content', { filename })

    const sm = await this.aws.getFile(filename)
    if (sm.Body) {
      return sm.Body.transformToString('base64')
    } else {
      throw new Error('error getting file')
    }
  }
}
