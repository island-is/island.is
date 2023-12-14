import { Module } from '@nestjs/common'
import { DocumentResolver } from './document.resolver'
import { DocumentService } from './document.service'
import { DocumentsClientModule } from '@island.is/clients/documents'
import { DocumentsV2ClientModule } from '@island.is/clients/documents-v2'
import { DocumentBuilder } from './documentBuilder'

@Module({
  imports: [DocumentsClientModule, DocumentsV2ClientModule],
  providers: [DocumentBuilder, DocumentResolver, DocumentService],
})
export class DocumentsModule {}
