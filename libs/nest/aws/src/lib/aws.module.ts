import { Module } from '@nestjs/common'
import { AwsService } from './aws.service'
import { S3Client } from '@aws-sdk/client-s3'

@Module({
  controllers: [],
  providers: [
    AwsService,
    {
      provide: S3Client,
      useValue: new S3Client(),
    },
  ],
  exports: [AwsService, S3Client],
})
export class AwsModule {}
