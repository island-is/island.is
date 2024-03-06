import { Module } from '@nestjs/common'
import { DocumentsClientV2Module } from '@island.is/clients/documents-v2'
import { DocumentsClientModule } from '@island.is/clients/documents'
import { DocumentBuilder } from './documentBuilder'
import { DocumentServiceV2 } from './documentV2.service'
import { DocumentResolverV1 } from './documentV1.resolver'
import { DocumentResolverV2 } from './documentV2.resolver'
import { DocumentService } from './documentV1.service'

@Module({
  imports: [DocumentsClientV2Module, DocumentsClientModule],
  providers: [
    DocumentResolverV2,
    DocumentResolverV1,
    DocumentService,
    DocumentServiceV2,
    DocumentBuilder,
  ],
})
export class DocumentModule {}
