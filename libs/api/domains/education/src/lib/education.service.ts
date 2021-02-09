import { Inject, Injectable } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'
import { EmailService } from '@island.is/email-service'

import { Config } from './education.module'
import { License, SendLicense } from './education.type'
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

  async getLicenses(nationalId: User['nationalId']): Promise<License[]> {
    const licenses = await this.mmsApi.getLicenses(nationalId)

    return licenses.map((license) => ({
      id: license.id,
      school: license.school,
      programme: license.programme,
      date: license.date,
    }))
  }

  async sendLicense(
    nationalId: string,
    email: string,
    licenseId: string,
  ): Promise<SendLicense> {
    const pdf = await this.mmsApi.getLicensePDF(licenseId)
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
