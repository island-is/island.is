import { Inject, Injectable } from '@nestjs/common'
import { ValidationFailed } from '@island.is/nest/problem'
import { EmailService } from '@island.is/email-service'
import { ZendeskService } from '@island.is/clients/zendesk'
import {
  ContentfulRepository,
  CmsContentfulService,
  localeMap,
} from '@island.is/cms'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ContactUsInput } from './dto/contactUs.input'
import { TellUsAStoryInput } from './dto/tellUsAStory.input'
import {
  ServiceWebFormsInput,
  ServiceWebFormsInputWithInstitutionEmail,
} from './dto/serviceWebForms.input'
import { getTemplate as getContactUsTemplate } from './emailTemplates/contactUs'
import { getTemplate as getTellUsAStoryTemplate } from './emailTemplates/tellUsAStory'
import { getTemplate as getServiceWebFormsTemplate } from './emailTemplates/serviceWebForms'
import { GenericFormInput } from './dto/genericForm.input'
import { environment } from './environments/environment'

type SendEmailInput =
  | ContactUsInput
  | TellUsAStoryInput
  | ServiceWebFormsInputWithInstitutionEmail

@Injectable()
export class CommunicationsService {
  constructor(
    private readonly emailService: EmailService,
    private readonly zendeskService: ZendeskService,
    private readonly cmsContentfulService: CmsContentfulService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}
  emailTypeTemplateMap = {
    contactUs: getContactUsTemplate,
    tellUsAStory: getTellUsAStoryTemplate,
    serviceWebForms: getServiceWebFormsTemplate,
  }

  getEmailTemplate(input: SendEmailInput) {
    if (this.emailTypeTemplateMap[input.type]) {
      return this.emailTypeTemplateMap[input.type](input as never)
    } else {
      throw new Error('Message type is not supported')
    }
  }

  async getInputWithInstitutionEmail(
    input: ServiceWebFormsInput,
  ): Promise<ServiceWebFormsInputWithInstitutionEmail> {
    const institutionSlug = input.institutionSlug

    const contentfulRespository = new ContentfulRepository()

    let locale = localeMap['is']

    if (input.lang && localeMap[input.lang]) {
      locale = localeMap[input.lang]
    }

    const result = await contentfulRespository.getLocalizedEntries(locale, {
      ['content_type']: 'organization',
      'fields.slug': institutionSlug,
    })

    const errors: Record<string, string> = {}

    const item = result?.items?.[0]

    if (!item) {
      errors[
        'institutionSlug'
      ] = `Unexpected institution slug "${institutionSlug}"`
    }

    const institutionEmail = (item?.fields as { email?: string })?.email

    if (!institutionEmail) {
      errors['institutionEmail'] = 'Institution email not found'
    }

    if (Object.keys(errors).length) {
      throw new ValidationFailed(errors)
    }

    return {
      ...input,
      institutionEmail: institutionEmail!,
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

  async sendFormResponseEmail(input: GenericFormInput): Promise<boolean> {
    const form = await this.cmsContentfulService.getForm({
      id: input.id,
      lang: 'is-IS',
    })
    if (!form) {
      return false
    }

    let recipient = form.recipient

    const emailConfig = form.recipientFormFieldDecider?.emailConfig
    const key: string | undefined = input.recipientFormFieldDeciderValue

    // The CMS might have a form field which decides what the recipient email address is
    if (!!key && emailConfig && emailConfig[key]) {
      recipient = emailConfig[key]
    }

    const emailOptions = {
      from: {
        name: input.name,
        address: environment.emailOptions.sendFrom!,
      },
      replyTo: {
        name: input.name,
        address: input.email,
      },
      to: recipient,
      subject: `Island.is form: ${form.title}`,
      text: input.message,
    }

    try {
      await this.emailService.sendEmail(emailOptions)
      return true
    } catch (error) {
      this.logger.error('Failed to send email', { message: error.message })
      return false
    }
  }
}
