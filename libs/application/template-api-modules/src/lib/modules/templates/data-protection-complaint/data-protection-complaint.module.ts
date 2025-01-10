import { Module } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// Here you import your module service
import { DataProtectionComplaintService } from './data-protection-complaint.service'
import { ClientsDataProtectionComplaintModule } from '@island.is/clients/data-protection-complaint'
import { FileStorageModule } from '@island.is/file-storage'
import { ApplicationAttachmentProvider } from './attachments/providers/applicationAttachmentProvider'
import { PdfFileProvider } from './attachments/providers/pdfFileProvider'
import { AttachmentS3Service } from './attachments/attachment-s3.service'
import { AwsModule } from '@island.is/nest/aws'

@Module({
  imports: [
    SharedTemplateAPIModule,
    FileStorageModule,
    ClientsDataProtectionComplaintModule,
    AwsModule,
  ],
  providers: [
    ApplicationAttachmentProvider,
    PdfFileProvider,
    AttachmentS3Service,
    DataProtectionComplaintService,
  ],
  exports: [DataProtectionComplaintService],
})
export class DataProtectionComplaintModule {}
