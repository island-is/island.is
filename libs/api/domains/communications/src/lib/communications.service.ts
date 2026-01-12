import axios from 'axios'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { ValidationFailed } from '@island.is/nest/problem'
import { EmailService } from '@island.is/email-service'
import { ZendeskService } from '@island.is/clients/zendesk'
import { FileStorageService } from '@island.is/file-storage'
import {
  ContentfulRepository,
  CmsContentfulService,
  localeMap,
  Form,
  CmsElasticsearchService,
  ServiceWebPage,
} from '@island.is/cms'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ContactUsInput } from './dto/contactUs.input'
import { TellUsAStoryInput } from './dto/tellUsAStory.input'
import {
  ServiceWebFormsInput,
  ServiceWebFormsInputWithInstitutionEmailAndConfig,
} from './dto/serviceWebForms.input'
import { getTemplate as getContactUsTemplate } from './emailTemplates/contactUs'
import { getTemplate as getTellUsAStoryTemplate } from './emailTemplates/tellUsAStory'
import { getTemplate as getServiceWebFormsTemplate } from './emailTemplates/serviceWebForms'
import { GenericFormInput } from './dto/genericForm.input'
import { environment } from './environments/environment'
import { CommunicationsConfig } from './communications.config'
import { getElasticsearchIndex } from '@island.is/content-search-index-manager'

type SendEmailInput =
  | ContactUsInput
  | TellUsAStoryInput
  | ServiceWebFormsInputWithInstitutionEmailAndConfig

@Injectable()
export class CommunicationsService {
  constructor(
    private readonly emailService: EmailService,
    private readonly zendeskService: ZendeskService,
    private readonly cmsContentfulService: CmsContentfulService,
    private readonly fileStorageService: FileStorageService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(CommunicationsConfig.KEY)
    private readonly config: ConfigType<typeof CommunicationsConfig>,
    private readonly cmsElasticsearchService: CmsElasticsearchService,
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
  ): Promise<ServiceWebFormsInputWithInstitutionEmailAndConfig> {
    const institutionSlug = input.institutionSlug

    const contentfulRespository = new ContentfulRepository()

    let locale = localeMap['is']

    if (input.lang && localeMap[input.lang]) {
      locale = localeMap[input.lang]
    }

    const [institutionResult, serviceWebPageResult] = await Promise.all([
      contentfulRespository.getLocalizedEntries(locale, {
        ['content_type']: 'organization',
        'fields.slug': institutionSlug,
      }),
      this.cmsElasticsearchService.getSingleDocumentTypeBySlug<ServiceWebPage>(
        getElasticsearchIndex('is'),
        { type: 'webServiceWebPage', slug: institutionSlug },
      ),
    ])

    const errors: Record<string, string> = {}

    const item = institutionResult?.items?.[0]

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
      config: serviceWebPageResult
        ? serviceWebPageResult.emailConfig
        : { emails: [] },
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

  async sendFormResponse(input: GenericFormInput): Promise<boolean> {
    const form = await this.cmsContentfulService.getForm({
      id: input.id,
      lang: input.lang === 'en' ? 'en' : 'is-IS',
    })
    if (!form) {
      return false
    }

    if (form.id === this.config.hsnWebFormId) {
      try {
        const response = await axios.post(
          this.config.hsnWebFormResponseUrl,
          {
            Nafn: input.name,
            Netfang: input.email,
            Titill: `Island.is form: ${form.title}`,
            Lysing: input.message,
            Starfsstod: input.recipientFormFieldDeciderValue,
          },
          {
            headers: {
              lykill: this.config.hsnWebFormResponseSecret,
              'Content-Type': 'application/json',
            },
          },
        )
        return response.status === 200
      } catch (error) {
        this.logger.error('Failed to send form response to HSN', {
          message: error.message,
        })
        return false
      }
    }

    return this.sendFormResponseEmail(input, form)
  }

  private async sendFormResponseEmail(
    input: GenericFormInput,
    form: Form,
  ): Promise<boolean> {
    let recipient: string | string[] = form.recipientList ?? []

    const emailConfig = form.recipientFormFieldDecider?.emailConfig
    const key: string | undefined = input.recipientFormFieldDeciderValue

    // The CMS might have a form field which decides what the recipient email address is
    if (!!key && emailConfig && emailConfig[key]) {
      recipient = emailConfig[key]
    }

    const attachments = await Promise.all(
      input.files?.map(async (file) => {
        return {
          filename: file,
          href: await this.fileStorageService.generateSignedUrl(
            this.fileStorageService.getObjectUrl(file),
          ),
        }
      }) ?? [],
    )

    let subject = `Island.is form: ${form.title}`

    if (form.emailSubject?.trim()) {
      subject = form.emailSubject.trim()
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
      subject,
      text: input.message,
      attachments,
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
