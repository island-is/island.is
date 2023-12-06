import { Module } from '@nestjs/common'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'
import { SignatureCollectionClientService } from './signature-collection.service'

@Module({
  controllers: [],
  providers: [
    ApiConfiguration,
    ...exportedApis,
    SignatureCollectionClientService,
  ],
  exports: [SignatureCollectionClientService],
})
export class SignatureCollectionClientModule {}
