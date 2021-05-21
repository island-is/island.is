import { Injectable, Inject } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import {
  generateConfirmationEmail,
} from './emailGenerators'

import { FileStorageService } from '@island.is/file-storage'
import { Application, getValueViaPath } from '@island.is/application/core'
import { FundingAttachment } from './types'
import { PublicDebtPaymentPlanConfig, PUBLIC_DEBT_PAYMENT_PLAN_CONFIG } from './config/publicDebtPaymentPlanConfig'

@Injectable()
export class PublicDebtPaymentPlanService {
  constructor(
    @Inject(PUBLIC_DEBT_PAYMENT_PLAN_CONFIG)
    private paymentPlanConfig: PublicDebtPaymentPlanConfig,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    const attachments = await this.prepareAttachments(application)

    await this.sharedTemplateAPIService.sendEmail(
      (props) =>
        generateConfirmationEmail(
          props,
          this.paymentPlanConfig.applicationSenderName,
          this.paymentPlanConfig.applicationSenderEmail,
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
    const hasattachments = attachments && attachments?.length > 0
    if (!hasattachments) {
      return []
    }

    return Promise.all(
      attachments.map(async ({ key, name }) => {
        const url = (application.attachments as {
          [key: string]: string
        })[key]
        const signedUrl = await this.fileStorageService.generateSignedUrl(
          url,
          key,
        )
        return { name, url: signedUrl }
      }),
    )
  }
}
