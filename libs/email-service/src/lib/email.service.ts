import nodemailer from 'nodemailer'
import { SES } from 'aws-sdk'

import { Inject } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

export const EMAIL_OPTIONS = 'EMAIL_OPTIONS'

export interface EmailServiceSESOptions {
  region: string
}

export interface EmailServiceOptions {
  useTestAccount: boolean
  options?: EmailServiceSESOptions
}

export class EmailService {
  constructor(
    @Inject(EMAIL_OPTIONS)
    private readonly options: EmailServiceOptions,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  private async getTransport() {
    if (this.options.useTestAccount) {
      this.logger.debug('Using nodemailer test account')

      const account = await nodemailer.createTestAccount()
      return {
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      }
    }

    this.logger.debug('Using SES')

    const cfg: SES.ClientConfiguration = {
      apiVersion: '2010-12-01',
    }
    if (this.options.options?.region) {
      cfg.region = this.options.options?.region
    }
    return {
      SES: new SES(cfg),
    }
  }

  async sendEmail(message: nodemailer.SendMailOptions): Promise<string> {
    let messageId = ''

    try {
      const transport = await this.getTransport()
      const transporter = nodemailer.createTransport(transport)

      const info = await transporter.sendMail(message)

      messageId = `${info.messageId}`

      this.logger.debug(`Message sent: ${info.messageId}`)

      if (this.options.useTestAccount) {
        this.logger.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
      }
    } catch (e) {
      this.logger.error(`Fatal error when sending email: ${e}`, e)
    }

    return messageId
  }
}
