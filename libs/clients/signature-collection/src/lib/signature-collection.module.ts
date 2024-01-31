import { Module } from '@nestjs/common'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'
import { SignatureCollectionClientService } from './signature-collection.service'
import { SignatureCollectionAdminClientService } from './signature-collection-admin.service'
import { SignatureCollectionManagerClientService } from './signature-collection-manager.service'

@Module({
  providers: [
    ApiConfiguration,
    ...exportedApis,
    SignatureCollectionClientService,
    SignatureCollectionAdminClientService,
    SignatureCollectionManagerClientService,
  ],
  exports: [
    SignatureCollectionClientService,
    SignatureCollectionAdminClientService,
    SignatureCollectionManagerClientService,
  ],
})
export class SignatureCollectionClientModule {}
