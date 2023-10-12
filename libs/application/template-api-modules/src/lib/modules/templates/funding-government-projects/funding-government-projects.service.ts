import { Injectable, Inject } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import {
  generateApplicationEmail,
  generateConfirmationEmail,
} from './emailGenerators'
import type { FundingGovernmentProjectsConfig } from './config/fundingFovernmentProjectsConfig'
import { FUNDING_GOVERNMENT_PROJECTS_CONFIG } from './config/fundingFovernmentProjectsConfig'
import { FileStorageService } from '@island.is/file-storage'
import { getValueViaPath } from '@island.is/application/core'
import {
  ApplicationTypes,
  ApplicationWithAttachments as Application,
} from '@island.is/application/types'
import { FundingAttachment } from './types'
import { BaseTemplateApiService } from '../../base-template-api.service'

@Injectable()
export class FundingGovernmentProjectsService extends BaseTemplateApiService {
  constructor(
    @Inject(FUNDING_GOVERNMENT_PROJECTS_CONFIG)
    private fundingConfig: FundingGovernmentProjectsConfig,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly fileStorageService: FileStorageService,
  ) {
    super(ApplicationTypes.FUNDING_GOVERNMENT_PROJECTS)
  }

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
        const url = (
          application.attachments as {
            [key: string]: string
          }
        )[key]

        const signedUrl = await this.fileStorageService.generateSignedUrl(url)

        return { name, url: signedUrl }
      }),
    )
  }
}
