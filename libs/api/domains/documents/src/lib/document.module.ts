import { Module } from '@nestjs/common'
import { DocumentResolver } from './document.resolver'
import { DocumentService } from './document.service'
import { DocumentsClientV2Module } from '@island.is/clients/documents-v2'
import { DocumentsClientModule } from '@island.is/clients/documents'
import { DocumentBuilder } from './documentBuilder'

@Module({
  imports: [DocumentsClientV2Module, DocumentsClientModule],
  providers: [DocumentResolver, DocumentService, DocumentBuilder],
})
export class DocumentModule {}
