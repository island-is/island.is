import { Module } from '@nestjs/common'
import { S3Service } from './s3.service'
import { S3Client } from '@aws-sdk/client-s3'
import { defaultProvider } from '@aws-sdk/credential-provider-node'

@Module({
  controllers: [],
  providers: [
    S3Service,
    {
      provide: S3Client,
      useFactory: () => {
        return new S3Client({
          credentials: defaultProvider(),
          maxAttempts: 3,
        })
      },
    },
  ],
  exports: [S3Service],
})
export class AwsModule {}
