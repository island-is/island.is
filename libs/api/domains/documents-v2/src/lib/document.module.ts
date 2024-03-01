import { Module } from '@nestjs/common'
import { DocumentResolver } from './document.resolver'
import { DocumentService } from './document.service'
import { DocumentsClientV2Module } from '@island.is/clients/documents-v2'
import { DocumentBuilder } from './documentBuilder'

@Module({
  imports: [DocumentsClientV2Module],
  providers: [DocumentBuilder, DocumentResolver, DocumentService],
})
export class DocumentsV2Module {}
