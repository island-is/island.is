import { Module } from '@nestjs/common'
import { DocumentsClientService } from './documentsClient.service'
import { DocumentsClientProvider } from './documentsClient.provider'

@Module({
  providers: [DocumentsClientProvider, DocumentsClientService],
  exports: [DocumentsClientService],
})
export class DocumentsClientModule {}
