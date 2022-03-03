import { Inject,Injectable } from '@nestjs/common'

import {
  ApplicationWithAttachments as Application,
  getValueViaPath,
} from '@island.is/application/core'
import { FileStorageService } from '@island.is/file-storage'

import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'

import type { FundingGovernmentProjectsConfig } from './config/fundingFovernmentProjectsConfig'
import { FUNDING_GOVERNMENT_PROJECTS_CONFIG } from './config/fundingFovernmentProjectsConfig'
import {
  generateApplicationEmail,
  generateConfirmationEmail,
} from './emailGenerators'
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
      'project.attachments',
    ) as Array<{ key: string; name: string }>
    const hasAttachments = attachments && attachments?.length > 0

    if (!hasAttachments) {
      return []
    }

    return await Promise.all(
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
