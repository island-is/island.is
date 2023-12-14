import { Module } from '@nestjs/common'
import { DocumentsV2ClientService } from './documentsV2Client.service'
import { DocumentsClientProvider } from './documentsV2Client.provider'

@Module({
  providers: [DocumentsClientProvider, DocumentsV2ClientService],
  exports: [DocumentsV2ClientService],
})
export class DocumentsV2ClientModule {}
