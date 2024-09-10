import { Module } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../../shared'

// Here you import your module service
import { ParliamentaryListCreationService } from './parliamentary-list-creation.service'
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
  providers: [ParliamentaryListCreationService, NationalRegistryClientService],
  exports: [ParliamentaryListCreationService],
})
export class ParliamentaryListCreationModule {}
