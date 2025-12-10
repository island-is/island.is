import { Module } from '@nestjs/common'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'
import { SignatureCollectionClientService } from './signature-collection.service'
import { SignatureCollectionAdminClientService } from './signature-collection-admin.service'
import { SignatureCollectionManagerClientService } from './signature-collection-manager.service'
import { SignatureCollectionSharedClientService } from './signature-collection-shared.service'
import { SignatureCollectionMunicipalityClientService } from './signature-collection-municipality.service'

@Module({
  providers: [
    ApiConfiguration,
    ...exportedApis,
    SignatureCollectionClientService,
    SignatureCollectionAdminClientService,
    SignatureCollectionManagerClientService,
    SignatureCollectionSharedClientService,
    SignatureCollectionMunicipalityClientService,
  ],
  exports: [
    SignatureCollectionClientService,
    SignatureCollectionAdminClientService,
    SignatureCollectionManagerClientService,
    SignatureCollectionMunicipalityClientService,
  ],
})
export class SignatureCollectionClientModule {}
