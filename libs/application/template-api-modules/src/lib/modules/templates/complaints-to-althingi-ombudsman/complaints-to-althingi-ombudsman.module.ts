import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'

// Here you import your module service
import { ComplaintsToAlthingiOmbudsmanTemplateService } from './complaints-to-althingi-ombudsman.service'
import { COMPLAINTS_TO_ALTHINGI_OMBUDSMAN_CONFIG } from './config'

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
      imports: [SharedTemplateAPIModule.register(config)],
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
      ],
      exports: [ComplaintsToAlthingiOmbudsmanTemplateService],
    }
  }
}
