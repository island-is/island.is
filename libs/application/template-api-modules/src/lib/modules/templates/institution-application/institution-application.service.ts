import { Injectable, Inject } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import {
  generateApplicationEmail,
  generateConfirmationEmail,
} from './emailGenerators'
import {
  INSTITUTION_APPLICATION_CONFIG,
  InstitutionApplicationConfig,
} from './config/institutionApplicationServiceConfig'

@Injectable()
export class InstitutionApplicationService {
  constructor(
    @Inject(INSTITUTION_APPLICATION_CONFIG)
    private institutionConfig: InstitutionApplicationConfig,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      (props) =>
        generateApplicationEmail(
          props,
          this.institutionConfig.senderEmailAddress,
          this.institutionConfig.recipientEmailAddress,
        ),
      application,
    )

    await this.sharedTemplateAPIService.sendEmail(
      (props) => generateConfirmationEmail(props, this.institutionConfig.senderEmailAddress),
      application,
    )
  }
}
