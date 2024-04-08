import { Module } from '@nestjs/common'
import { DocumentsClientV2Provider } from './documentsClientV2.provider'
import { DocumentsClientV2Service } from './documentsClientV2.service'
@Module({
  providers: [DocumentsClientV2Provider, DocumentsClientV2Service],
  exports: [DocumentsClientV2Service],
})
export class DocumentsClientV2Module {}
