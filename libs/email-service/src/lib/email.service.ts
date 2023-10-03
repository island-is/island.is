import { SES } from 'aws-sdk'
import nodemailer from 'nodemailer'

import { Inject } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { AdapterService } from '../tools/adapter.service'
import { Message } from '../types'

export const EMAIL_OPTIONS = 'EMAIL_OPTIONS'

export interface EmailServiceSESOptions {
  region: string
}

export interface EmailServiceOptions {
  useTestAccount: boolean
  useNodemailerApp?: boolean
  options?: EmailServiceSESOptions
}

export class EmailService {
  constructor(
    @Inject(EMAIL_OPTIONS)
    private readonly options: EmailServiceOptions,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private adapterService: AdapterService,
  ) {}

  private async getTransport() {
    if (this.options.useNodemailerApp) {
      this.logger.debug('Using nodemailer app to preview emails')

      return {
        host: 'localhost',
        port: 1025,
        auth: {
          user: 'project.1',
          pass: 'secret.1',
        },
      }
    }

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

  async sendEmail(message: Message): Promise<string> {
    let messageId = ''

    try {
      const transport = await this.getTransport()
      const transporter = nodemailer.createTransport(transport)

      if (message.template) {
        const { html, attachments } =
          await this.adapterService.buildCustomTemplate(message.template)

        message.html = html
        message.attachments = (message.attachments ?? []).concat(attachments)
      }

      const info = await transporter.sendMail(message)

      messageId = `${info.messageId}`

      this.logger.info(`Message sent: ${messageId}`)

      if (this.options.useNodemailerApp) {
        this.logger.debug(
          'You can now preview the email within the NodemailerApp.',
        )
      } else if (this.options.useTestAccount) {
        this.logger.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
      }
    } catch (e) {
      this.logger.error(`Fatal error when sending email: ${e}`, e)
      throw e
    }

    return messageId
  }
}
