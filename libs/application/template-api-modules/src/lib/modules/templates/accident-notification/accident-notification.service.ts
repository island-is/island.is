import { Injectable, Inject } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  generateAssignReviewerEmail,
  generateConfirmationEmail,
} from './emailGenerators'
import type { AccidentNotificationConfig } from './config'
import { ACCIDENT_NOTIFICATION_CONFIG } from './config'
import { FileStorageService } from '@island.is/file-storage'
import { Attachment } from 'nodemailer/lib/mailer'
import {
  Application,
  FormValue,
  getValueViaPath,
} from '@island.is/application/core'
import { utils } from '@island.is/application/templates/accident-notification'

const SIX_MONTHS_IN_SECONDS_EXPIRES = 6 * 30 * 24 * 60 * 60

@Injectable()
export class AccidentNotificationService {
  constructor(
    @Inject(ACCIDENT_NOTIFICATION_CONFIG)
    private accidentConfig: AccidentNotificationConfig,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    const attachments = await this.prepareAttachments(application)
    const shouldRequestReview =
      !utils.isHomeActivitiesAccident(application.answers) &&
      !utils.isRepresentativeOfCompanyOrInstitute(application.answers)

    // Send confirmation email to applicant
    await this.sharedTemplateAPIService.sendEmail(
      (props) =>
        generateConfirmationEmail(
          props,
          this.accidentConfig.applicationSenderName,
          this.accidentConfig.applicationSenderEmail,
          attachments,
        ),
      application,
    )

    // Request representative review when applicable
    if (shouldRequestReview) {
      await this.sharedTemplateAPIService.assignApplicationThroughEmail(
        generateAssignReviewerEmail,
        application,
        SIX_MONTHS_IN_SECONDS_EXPIRES,
      )
    }
  }

  // Generating signedUrls for mail attachments
  private async prepareAttachments(
    application: Application,
  ): Promise<Attachment[]> {
    const powerOfAttorneyFiles = this.getFilesFromAnswers(
      application.answers,
      'attachments.powerOfAttorneyFile',
    )
    const deathCertificateFiles = this.getFilesFromAnswers(
      application.answers,
      'attachments.deathCertificateFile',
    )
    const injuryCertificateFiles = this.getFilesFromAnswers(
      application.answers,
      'attachments.injuryCertificateFile',
    )

    const attachments = [
      ...powerOfAttorneyFiles,
      ...deathCertificateFiles,
      ...injuryCertificateFiles,
    ]

    return await Promise.all(
      attachments.map(async ({ key, name }) => {
        const url = (application.attachments as {
          [key: string]: string
        })[key]

        const signedUrl = await this.fileStorageService.generateSignedUrl(url)

        return { filename: name, href: signedUrl }
      }),
    )
  }

  private getFilesFromAnswers(answers: FormValue, id: string) {
    return (
      (getValueViaPath(answers, id) as Array<{ key: string; name: string }>) ??
      []
    )
  }
}
