import { Injectable, Inject } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import {
  generateApplicationEmail,
  generateConfirmationEmail,
} from './emailGenerators'
import {
  FUNDING_GOVERNMENT_PROJECTS_CONFIG,
  FundingGovernmentProjectsConfig,
} from './config/fundingFovernmentProjectsConfig'
import { FileStorageService } from '@island.is/file-storage'
import { Application, getValueViaPath } from '@island.is/application/core'
import { FundingAttachment } from './types'

@Injectable()
export class FundingGovernmentProjectsService {
  constructor(
    @Inject(FUNDING_GOVERNMENT_PROJECTS_CONFIG)
    private fundingConfig: FundingGovernmentProjectsConfig,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    const attachments = await this.prepareAttachments(application)

    await this.sharedTemplateAPIService.sendEmail(
      (props) =>
        generateApplicationEmail(
          props,
          this.fundingConfig.applicationSenderName,
          this.fundingConfig.applicationSenderEmail,
          this.fundingConfig.applicationRecipientName,
          this.fundingConfig.applicationRecipientEmail,
          attachments,
        ),
      application,
    )

    await this.sharedTemplateAPIService.sendEmail(
      (props) =>
        generateConfirmationEmail(
          props,
          this.fundingConfig.applicationSenderName,
          this.fundingConfig.applicationSenderEmail,
          attachments,
        ),
      application,
    )
  }

  // Generating signedUrls for mail attachments
  private async prepareAttachments(
    application: Application,
  ): Promise<FundingAttachment[]> {
    const attachments = getValueViaPath(
      application.answers,
      'attachments',
    ) as Array<{ key: string; name: string }>
    const hasattachments = attachments && attachments?.length > 0
    if (!hasattachments) {
      return []
    }

    return Promise.all(
      attachments.map(async ({ key, name }) => {
        const url = (application.attachments as {
          [key: string]: string
        })[key]
        const signedUrl = await this.fileStorageService.generateSignedUrl(url)
        return { name, url: signedUrl }
      }),
    )
  }
}
