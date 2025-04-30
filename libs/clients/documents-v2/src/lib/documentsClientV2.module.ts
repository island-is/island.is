import { Module } from '@nestjs/common'
import {
  DocumentsClientListV2Provider,
  DocumentsClientV2Provider,
} from './documentsClientV2.provider'
import { DocumentsClientV2Service } from './documentsClientV2.service'
import { DocumentsListClientV2Service } from './documentsListClientV2.service'
@Module({
  providers: [
    DocumentsClientV2Provider,
    DocumentsClientListV2Provider,
    DocumentsClientV2Service,
  ],
  exports: [DocumentsClientV2Service, DocumentsListClientV2Service],
})
export class DocumentsClientV2Module {}
