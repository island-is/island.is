import { Module } from '@nestjs/common'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'
import { SignatureCollectionClientService } from './signature-collection.service'
import { SignatureCollectionAdmminClientService } from './signature-collection-admin.service'

@Module({
  providers: [
    ApiConfiguration,
    ...exportedApis,
    SignatureCollectionClientService,
    SignatureCollectionAdmminClientService,
  ],
  exports: [
    SignatureCollectionClientService,
    SignatureCollectionAdmminClientService,
  ],
})
export class SignatureCollectionClientModule {}
