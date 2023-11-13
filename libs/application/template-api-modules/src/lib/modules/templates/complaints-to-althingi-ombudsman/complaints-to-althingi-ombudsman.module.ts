import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { ComplaintsToAlthingiOmbudsmanTemplateService } from './complaints-to-althingi-ombudsman.service'
import { COMPLAINTS_TO_ALTHINGI_OMBUDSMAN_CONFIG } from './config'
import { ClientsAlthingiOmbudsmanModule } from '@island.is/clients/althingi-ombudsman'
import { ApplicationAttachmentProvider } from './attachments/providers/applicationAttachmentProvider'

const applicationRecipientName =
  process.env.COMPLAINTS_TO_ALTHINGI_OMBUDSMAN_APPLICATION_RECIPIENT_NAME ?? ''

const applicationRecipientEmail =
  process.env
    .COMPLAINTS_TO_ALTHINGI_OMBUDSMAN_APPLICATION_RECIPIENT_EMAIL_ADDRESS ??
  'island@island.is'

const applicationSenderName = process.env.EMAIL_FROM_NAME ?? ''

const applicationSenderEmail = process.env.EMAIL_FROM ?? 'development@island.is'

export class ComplaintsToAlthingiOmbudsmanTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ComplaintsToAlthingiOmbudsmanTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        ClientsAlthingiOmbudsmanModule,
      ],
      providers: [
        {
          provide: COMPLAINTS_TO_ALTHINGI_OMBUDSMAN_CONFIG,
          useValue: {
            applicationRecipientName,
            applicationRecipientEmail,
            applicationSenderName,
            applicationSenderEmail,
          },
        },
        ComplaintsToAlthingiOmbudsmanTemplateService,
        ApplicationAttachmentProvider,
      ],
      exports: [ComplaintsToAlthingiOmbudsmanTemplateService],
    }
  }
}
