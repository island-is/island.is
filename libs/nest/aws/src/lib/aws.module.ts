import { Module } from '@nestjs/common'
import { AwsService } from './aws.service'

@Module({
  controllers: [],
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule {}
