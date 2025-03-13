import { Module } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../../shared'

// Here you import your module service
import { MunicipalListSigningService } from './municipal-list-signing.service'
import { SignatureCollectionClientModule } from '@island.is/clients/signature-collection'
import {
  NationalRegistryClientModule,
  NationalRegistryClientService,
} from '@island.is/clients/national-registry-v2'

@Module({
  imports: [
    SharedTemplateAPIModule,
    SignatureCollectionClientModule,
    NationalRegistryClientModule,
  ],
  providers: [MunicipalListSigningService, NationalRegistryClientService],
  exports: [MunicipalListSigningService],
})
export class MunicipalListSigningModule {}
