import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'

// Here you import your module service
import { DataProtectionComplaintService } from './data-protection-complaint.service'
import { ClientsDataProtectionComplaintModule } from '@island.is/clients/data-protection-complaint'
import { FileStorageModule } from '@island.is/file-storage'
import { ApplicationAttachmentProvider } from './attachments/providers/applicationAttachmentProvider'
import { PdfFileProvider } from './attachments/providers/pdfFileProvider'
import { AttachmentS3Service } from './attachments/attachment-s3.service'

export class DataProtectionComplaintModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: DataProtectionComplaintModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        FileStorageModule,
        ClientsDataProtectionComplaintModule.register(
          config.dataProtectionComplaint,
        ),
      ],
      providers: [
        ApplicationAttachmentProvider,
        PdfFileProvider,
        AttachmentS3Service,
        DataProtectionComplaintService,
      ],
      exports: [DataProtectionComplaintService],
    }
  }
}
