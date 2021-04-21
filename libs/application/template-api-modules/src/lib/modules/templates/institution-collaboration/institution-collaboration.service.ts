import { Injectable, Inject } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import {
  generateApplicationEmail,
  generateConfirmationEmail,
} from './emailGenerators'
import {
  INSTITUTION_COLLABORATION_CONFIG,
  InstitutionCollaborationConfig,
} from './config/institutionApplicationServiceConfig'
import { FileStorageService } from '@island.is/file-storage'
import { Application, getValueViaPath } from '@island.is/application/core'
import { InstitutionAttachment } from './types'

@Injectable()
export class InstitutionCollaborationService {
  constructor(
    @Inject(INSTITUTION_COLLABORATION_CONFIG)
    private institutionConfig: InstitutionCollaborationConfig,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    const attachments = this.prepareAttachments(application)

    await this.sharedTemplateAPIService.sendEmail(
      (props) =>
        generateApplicationEmail(
          props,
          this.institutionConfig.applicationSenderName,
          this.institutionConfig.applicationSenderEmail,
          this.institutionConfig.applicationRecipientName,
          this.institutionConfig.applicationRecipientEmail,
          attachments,
        ),
      application,
    )

    await this.sharedTemplateAPIService.sendEmail(
      (props) =>
        generateConfirmationEmail(
          props,
          this.institutionConfig.applicationSenderName,
          this.institutionConfig.applicationSenderEmail,
          attachments,
        ),
      application,
    )
  }

  // Generating signedUrls for mail attachments
  private prepareAttachments(
    application: Application,
  ): InstitutionAttachment[] {
    const attachments = getValueViaPath(
      application.answers,
      'attachments',
    ) as Array<{ key: string; name: string }>
    const hasattachments = attachments && attachments?.length > 0
    if (!hasattachments) {
      return []
    }
    return attachments.map(({ key, name }) => {
      const url = (application.attachments as {
        [key: string]: string
      })[key]
      return { name, url: this.fileStorageService.generateSignedUrl(url) }
    })
  }
}
