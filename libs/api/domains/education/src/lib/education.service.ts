import { Inject, Injectable } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'
import { EmailService } from '@island.is/email-service'

import { Config } from './education.module'
import { TeachingLicense, TeachingLicenseRecipient } from './education.type'
import { MMSApi } from './client'

@Injectable()
export class EducationService {
  constructor(
    private readonly mmsApi: MMSApi,
    @Inject(EmailService)
    private readonly emailService: EmailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject('CONFIG')
    private readonly config: Config,
  ) {}

  async getTeachingLicenses(
    nationalId: User['nationalId'],
  ): Promise<TeachingLicense[]> {
    const teachingLicenses = await this.mmsApi.getTeachingLicenses(nationalId)

    return teachingLicenses.map((teachingLicense) => ({
      id: teachingLicense.id,
    }))
  }

  async sendTeachingLicense(
    nationalId: string,
    email: string,
    teachingLicenseId: string,
  ): Promise<SendTeachingLicense> {
    const pdf = await this.mmsApi.getTeachingLicensePDF(teachingLicenseId)
    const text = `Leyfisbréf hefur verið deilt af mínum síðum frá notanda ${nationalId}, sjá viðhengi.`

    try {
      await this.emailService.sendEmail({
        from: {
          name: 'Stafrænt Ísland',
          address: this.config.emailOptions.sendFromEmail,
        },
        to: [
          {
            name: '',
            address: email,
          },
        ],
        subject: `Leyfisbréf deilt frá notanda ${nationalId}`,
        text,
        html: text,
        attachments: [
          {
            filename: pdf.filename,
            content: pdf.content,
            encoding: 'binary',
          },
        ],
      })
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}`, error)
      return null
    }
    return { email }
  }
}
