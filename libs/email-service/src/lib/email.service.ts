import { SES } from 'aws-sdk'
import nodemailer from 'nodemailer'

import { Inject } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'

import { AdapterService } from '../tools/adapter.service'
import { Message } from '../types'
import { emailModuleConfig } from './email.config'

export class EmailService {
  constructor(
    @Inject(emailModuleConfig.KEY)
    private readonly config: ConfigType<typeof emailModuleConfig>,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private adapterService: AdapterService,
  ) {}

  private async getTransport() {
    if (this.config.useNodemailerApp) {
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

    if (this.config.useTestAccount) {
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

    if (this.config.region) {
      cfg.region = this.config.region
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

      if (this.config.useNodemailerApp) {
        this.logger.debug(
          'You can now preview the email within the NodemailerApp.',
        )
      } else if (this.config.useTestAccount) {
        this.logger.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
      }
    } catch (e) {
      this.logger.error(`Fatal error when sending email: ${e}`, e)
      throw e
    }

    return messageId
  }
}
