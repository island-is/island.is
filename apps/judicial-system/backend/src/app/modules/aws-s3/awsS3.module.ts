import { Module } from '@nestjs/common'

import { AwsModule } from '@island.is/nest/aws'

import { AwsS3Service } from './awsS3.service'

@Module({
  imports: [AwsModule],
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
