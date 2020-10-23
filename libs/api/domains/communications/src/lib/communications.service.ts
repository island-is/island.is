import { Inject, Injectable } from '@nestjs/common'
import { EmailService } from '@island.is/email-service'
import { Logger, logger, LOGGER_PROVIDER } from '@island.is/logging'
import { SendMailOptions } from 'nodemailer'
import { ContactUsInput } from './dto/contactUs.input'
import { TellUsAStoryInput } from './dto/tellUsAStory.input'
import { getTemplate as getContactUsTemplate } from './emailTemplates/contactUs'
import { getTemplate as getTellUsAStoryTemplate } from './emailTemplates/tellUsAStory'

type SendEmailInput = ContactUsInput | TellUsAStoryInput
interface EmailTypeTemplateMap {
  [template: string]: (SendEmailInput) => SendMailOptions
}

@Injectable()
export class CommunicationsService {
  constructor(
    private readonly emailService: EmailService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}
  emailTypeTemplateMap: EmailTypeTemplateMap = {
    contactUs: getContactUsTemplate,
    tellUsAStory: getTellUsAStoryTemplate,
  }

  getEmailTemplate(input: SendEmailInput) {
    if (this.emailTypeTemplateMap[input.type]) {
      return this.emailTypeTemplateMap[input.type](input)
    } else {
      throw new Error('Message type is not supported')
    }
  }

  async sendEmail(input: SendEmailInput): Promise<boolean> {
    logger.info('Sending email', { type: input.type, from: input?.email ?? '' })
    try {
      const emailOptions = this.getEmailTemplate(input)
      await this.emailService.sendEmail(emailOptions)
      return true
    } catch (error) {
      logger.error('Failed to send email', { message: error.message })
      // we dont want the client to see these errors since they might contain sensitive data
      throw new Error('Failed to send message')
    }
  }
}
