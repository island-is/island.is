import { Injectable, Inject } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import {
  generateApplicationEmail,
  generateConfirmationEmail,
} from './emailGenerators'
import {
  LoginServiceConfig,
  LOGIN_SERVICE_CONFIG,
} from './config/loginServiceConfig'

@Injectable()
export class LoginServiceService {
  constructor(
    @Inject(LOGIN_SERVICE_CONFIG)
    private loginServiceConfig: LoginServiceConfig,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      (props) =>
        generateApplicationEmail(
          props,
          this.loginServiceConfig.applicationSenderName,
          this.loginServiceConfig.applicationSenderEmail,
          this.loginServiceConfig.applicationRecipientName,
          this.loginServiceConfig.applicationRecipientEmail,
        ),
      application,
    )

    await this.sharedTemplateAPIService.sendEmail(
      (props) =>
        generateConfirmationEmail(
          props,
          this.loginServiceConfig.applicationSenderName,
          this.loginServiceConfig.applicationSenderEmail,
        ),
      application,
    )
  }
}
