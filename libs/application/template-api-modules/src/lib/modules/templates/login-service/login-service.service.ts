import { Injectable, Inject } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import {
  generateApplicationEmail,
  generateConfirmationEmail,
} from './emailGenerators'
import type { LoginServiceConfig } from './config/loginServiceConfig'
import { LOGIN_SERVICE_CONFIG } from './config/loginServiceConfig'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'

@Injectable()
export class LoginServiceService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGIN_SERVICE_CONFIG)
    private loginServiceConfig: LoginServiceConfig,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.LOGIN_SERVICE)
  }

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
