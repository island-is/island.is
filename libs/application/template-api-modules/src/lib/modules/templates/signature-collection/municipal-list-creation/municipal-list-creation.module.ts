import { Module } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../../shared'

// Here you import your module service
import { MunicipalListCreationService } from './municipal-list-creation.service'
import { SignatureCollectionClientModule } from '@island.is/clients/signature-collection'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'

@Module({
  imports: [
    SharedTemplateAPIModule,
    SignatureCollectionClientModule,
    NationalRegistryClientModule,
  ],
  providers: [MunicipalListCreationService, NationalRegistryClientModule],
  exports: [MunicipalListCreationService],
})
export class MunicipalListCreationModule {}
