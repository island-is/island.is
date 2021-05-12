import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { LoginServiceService } from './login-service.service'
import { LOGIN_SERVICE_CONFIG } from './config/loginServiceConfig'

const applicationRecipientName =
  process.env.LOGIN_SERVICE_APPLICATION_RECIPIENT_NAME ?? ''

const applicationRecipientEmail =
  process.env.LOGIN_SERVICE_APPLICATION_RECIPIENT_EMAIL_ADDRESS ??
  'island@island.is'

const applicationSenderName = process.env.EMAIL_FROM_NAME ?? ''

const applicationSenderEmail = process.env.EMAIL_FROM ?? 'development@island.is'

export class LoginServiceModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: LoginServiceModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [
        {
          provide: LOGIN_SERVICE_CONFIG,
          useValue: {
            applicationRecipientName,
            applicationRecipientEmail,
            applicationSenderName,
            applicationSenderEmail,
          },
        },
        LoginServiceService,
      ],
      exports: [LoginServiceService],
    }
  }
}
