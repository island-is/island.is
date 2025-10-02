import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'
import { Inject, Injectable } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import { awsS3ModuleConfig } from './awsS3.config'

@Injectable()
export class AwsS3Service {
  private readonly s3: S3

  constructor(
    @Inject(awsS3ModuleConfig.KEY)
    private readonly config: ConfigType<typeof awsS3ModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    this.s3 = new S3({ region: this.config.region })
  }
}
