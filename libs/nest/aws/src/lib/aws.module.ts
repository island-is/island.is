import { Module } from '@nestjs/common'
import { S3Service } from './s3.service'
import { S3Client } from '@aws-sdk/client-s3'

@Module({
  controllers: [],
  providers: [
    S3Service,
    {
      provide: S3Client,
      useValue: new S3Client(),
    },
  ],
  exports: [S3Service],
})
export class AwsModule {}
