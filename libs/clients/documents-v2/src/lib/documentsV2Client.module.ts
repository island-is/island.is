import { Module } from '@nestjs/common'
import { DocumentsV2ClientService } from './documentsV2Client.service'
import { CustomersApiProvider } from './customersApiProvider'

@Module({
  providers: [CustomersApiProvider, DocumentsV2ClientService],
  exports: [DocumentsV2ClientService],
})
export class DocumentsV2ClientModule {}
