import { Inject, Injectable } from '@nestjs/common'
import axios from 'axios'
import toQueryString from 'to-querystring'
import { EmailService } from '@island.is/email-service'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { SendMailOptions } from 'nodemailer'
import { ContactUsInput } from './dto/contactUs.input'
import { TellUsAStoryInput } from './dto/tellUsAStory.input'
import { getTemplate as getContactUsTemplate } from './emailTemplates/contactUs'
import { getTemplate as getTellUsAStoryTemplate } from './emailTemplates/tellUsAStory'

import { environment } from './environments/environment'
const { zendeskOptions } = environment

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
    const api = `https://${zendeskOptions.subdomain}.zendesk.com/api/v2`

    const token = Buffer.from(
      `${zendeskOptions.email}/token:${zendeskOptions.token}`,
    ).toString('base64')

    const params = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${token}`,
      },
    }

    let searchUserResponse

    // First check if a user is found with this email
    try {
      searchUserResponse = await axios.get(
        `${api}/search.json?query=${encodeURIComponent(
          `type:user "${input.email}"`,
        )}`,
        params,
      )
    } catch (error) {
      this.logger.error('Failed to search for user', {
        message: error.response.data.description,
      })

      throw new Error(
        `Failed to search for user: ${error.response.data.description}`,
      )
    }

    let user =
      searchUserResponse.data.results.length > 0 &&
      searchUserResponse.data.results[0]

    // If we did not find an existing user we will create a new one
    if (!user) {
      let identities = []

      if (input.phone) {
        identities.push({
          type: 'phone_number',
          value: input.phone,
        })
      }

      const newUser = JSON.stringify({
        user: {
          name: input.name,
          email: input.email,
          identities,
        },
      })

      let createUserResponse

      try {
        createUserResponse = await axios.post(
          `${api}/users.json`,
          newUser,
          params,
        )
      } catch (error) {
        this.logger.error('Failed to create Zendesk user', {
          message: error.response.data.description,
        })

        throw new Error(
          `Failed to create Zendesk user: ${error.response.data.description}`,
        )
      }

      user = createUserResponse.data.user
    }

    const newTicket = JSON.stringify({
      ticket: {
        requester_id: user.id,
        subject: input.subject ?? '',
        comment: { body: input.message ?? '' },
        tags: ['web'],
      },
    })

    let createTicketResponse

    try {
      createTicketResponse = await axios.post(
        `${api}/tickets.json`,
        newTicket,
        params,
      )
    } catch (error) {
      this.logger.error('Failed to submit Zendesk ticket', {
        message: error.response.data.description,
      })

      throw new Error(
        `Failed to submit Zendesk ticket: ${error.response.data.description}`,
      )
    }

    return true
  }
}
