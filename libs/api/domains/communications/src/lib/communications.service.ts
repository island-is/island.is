import { Inject, Injectable } from '@nestjs/common'
import { EmailService } from '@island.is/email-service'
import { ZendeskService } from '@island.is/clients/zendesk'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { SendMailOptions } from 'nodemailer'
import { ContactUsInput } from './dto/contactUs.input'
import { TellUsAStoryInput } from './dto/tellUsAStory.input'
import { SyslumennFormsInput } from './dto/syslumennForms.input'
import { getTemplate as getContactUsTemplate } from './emailTemplates/contactUs'
import { getTemplate as getTellUsAStoryTemplate } from './emailTemplates/tellUsAStory'
import { getTemplate as getSyslumennFormsTemplate } from './emailTemplates/syslumennForms'

type SendEmailInput = ContactUsInput | TellUsAStoryInput | SyslumennFormsInput
interface EmailTypeTemplateMap {
  [template: string]: (SendEmailInput) => SendMailOptions
}

@Injectable()
export class CommunicationsService {
  constructor(
    private readonly emailService: EmailService,
    private readonly zendeskService: ZendeskService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}
  emailTypeTemplateMap: EmailTypeTemplateMap = {
    contactUs: getContactUsTemplate,
    tellUsAStory: getTellUsAStoryTemplate,
    syslumennForms: getSyslumennFormsTemplate,
  }

  getEmailTemplate(input: SendEmailInput) {
    if (this.emailTypeTemplateMap[input.type]) {
      return this.emailTypeTemplateMap[input.type](input)
    } else {
      throw new Error('Message type is not supported')
    }
  }

  async sendEmail(input: SendEmailInput): Promise<boolean> {
    this.logger.info('Sending email', { type: input.type })
    try {
      const emailOptions = this.getEmailTemplate(input)
      await this.emailService.sendEmail(emailOptions)
      return true
    } catch (error) {
      this.logger.error('Failed to send email', { message: error.message })
      // we dont want the client to see these errors since they might contain sensitive data
      throw new Error('Failed to send message')
    }
  }

  async sendZendeskTicket(input: ContactUsInput): Promise<boolean> {
    const name = input.name.trim()
    const email = input.email.trim().toLowerCase()
    const subject = input.subject
    const message = input.message
    const phone = input.phone

    let user = await this.zendeskService.getUserByEmail(email)

    if (!user) {
      user = await this.zendeskService.createUser(name, email, phone)
    }

    await this.zendeskService.submitTicket({
      message,
      requesterId: user.id,
      subject,
      tags: ['web'],
    })

    return true
  }
}
