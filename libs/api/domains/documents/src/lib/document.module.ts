import { Module } from '@nestjs/common'
import { DocumentsClientV2Module } from '@island.is/clients/documents-v2'
import { DocumentsClientModule } from '@island.is/clients/documents'
import { DocumentBuilder } from './documentBuilder'
import { DocumentServiceV2 } from './documentV2.service'
import { DocumentResolverV1 } from './documentV1.resolver'
import { DocumentResolverV2, SenderResolver } from './documentV2.resolver'
import { DocumentService } from './documentV1.service'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [DocumentsClientV2Module, DocumentsClientModule, FeatureFlagModule],
  providers: [
    DocumentResolverV2,
    DocumentResolverV1,
    DocumentService,
    DocumentServiceV2,
    DocumentBuilder,
    SenderResolver,
  ],
})
export class DocumentModule {}
