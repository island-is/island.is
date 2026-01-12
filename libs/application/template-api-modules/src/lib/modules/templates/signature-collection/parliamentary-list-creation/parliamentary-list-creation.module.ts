import { Module } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../../shared'

// Here you import your module service
import { ParliamentaryListCreationService } from './parliamentary-list-creation.service'
import { SignatureCollectionClientModule } from '@island.is/clients/signature-collection'
import { NationalRegistryV3Module } from '../../../shared/api/national-registry-v3/national-registry-v3.module'

@Module({
  imports: [
    SharedTemplateAPIModule,
    SignatureCollectionClientModule,
    NationalRegistryV3Module,
  ],
  providers: [ParliamentaryListCreationService],
  exports: [ParliamentaryListCreationService],
})
export class ParliamentaryListCreationModule {}
