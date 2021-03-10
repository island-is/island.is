import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { InstitutionApplicationService } from './institution-application.service'
import { INSTITUTION_APPLICATION_CONFIG } from './config/institutionApplicationServiceConfig'

const recipientEmailAddress =
  process.env.INSTITUTION_APPLICATION_RECIPIENT_EMAIL_ADDRESS ??
  'development@island.is'
const senderEmailAddress =
  process.env.INSTITUTION_APPLICATION_SENDER_EMAIL_ADDRESS ??
  'development@island.is'

export class InstitutionApplicationModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: InstitutionApplicationModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [
        {
          provide: INSTITUTION_APPLICATION_CONFIG,
          useValue: { recipientEmailAddress, senderEmailAddress },
        },
        InstitutionApplicationService,
      ],
      exports: [InstitutionApplicationService],
    }
  }
}
