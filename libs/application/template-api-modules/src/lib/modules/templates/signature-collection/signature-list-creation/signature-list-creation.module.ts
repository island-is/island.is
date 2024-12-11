import { Module } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../../shared'

// Here you import your module service
import { SignatureListCreationService } from './signature-list-creation.service'
import { SignatureCollectionClientModule } from '@island.is/clients/signature-collection'

@Module({
  imports: [SharedTemplateAPIModule, SignatureCollectionClientModule],
  providers: [SignatureListCreationService],
  exports: [SignatureListCreationService],
})
export class SignatureListCreationModule {}
