import { Inject } from '@nestjs/common'
import axios, { type AxiosResponse } from 'axios'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ZendeskServiceConfig } from './zendesk.config'
import type { ConfigType } from '@island.is/nest/config'

export enum TicketStatus {
  Open = 'open',
  Pending = 'pending',
  Solved = 'solved',
  Closed = 'closed',
  New = 'new',
  OnHold = 'on-hold',
}

export type UpdateTicketBody = {
  status?: TicketStatus
  comment?: Comment
  custom_fields?: Array<UpdateCustomField>
}

export type Comment = {
  body?: string
  public?: boolean
  html_body?: string
  author_id?: number
}

export type UpdateCustomField = {
  id: number
  value: string | boolean
}

export type SubmitTicketInput = {
  subject?: string
  message: string
  requesterId?: number
  requester?: {
    name: string
    email: string
  }
  tags?: Array<string>
  customFields?: Array<UpdateCustomField>
  brandId?: number
  ticketFormId?: number
}

export type User = {
  name: string
  email: string
  id: number
}

export type Ticket = {
  id: string
  status: TicketStatus | string
  custom_fields: Array<{ id: number; value: string }>
  tags: Array<string>
  description?: string
}

export interface ZendeskServiceOptions {
  email: string
  token: string
  subdomain: string
}

export type CustomObjectRecord = {
  name: string
  external_id?: string
  custom_object_fields: Record<string, string | null | undefined>
}

export class ZendeskService {
  api: string
  params: object

  constructor(
    @Inject(ZendeskServiceConfig.KEY)
    private readonly config: ConfigType<typeof ZendeskServiceConfig>,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {
    const token = Buffer.from(
      `${this.config.formEmail}/token:${this.config.formToken}`,
    ).toString('base64')

    this.api = `https://${config.subdomain}.zendesk.com/api/v2`

    this.params = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${token}`,
      },
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    let response

    try {
      response = await axios.get(
        `${this.api}/search.json?query=${encodeURIComponent(
          `email:"${email}"`,
        )}`,
        this.params,
      )
    } catch (e) {
      const errMsg = 'Failed to search for user'
      const description = e.response.data.description

      this.logger.error(errMsg, {
        message: description,
      })

      throw new Error(`${errMsg}: ${description}`)
    }

    if (response.data.results.length > 0) {
      return response.data.results[0]
    }

    return null
  }

  async createUser(name: string, email: string, phone?: string): Promise<User> {
    const identities = []

    if (phone) {
      identities.push({
        type: 'phone_number',
        value: phone,
      })
    }

    const newUser = JSON.stringify({
      user: {
        name,
        email,
        identities,
      },
    })

    let response

    try {
      response = await axios.post(
        `${this.api}/users.json`,
        newUser,
        this.params,
      )
    } catch (e) {
      const errMsg = 'Failed to create Zendesk user'
      const description = e.response.data.description

      this.logger.error(errMsg, {
        message: description,
      })

      throw new Error(`${errMsg}: ${description}`)
    }

    return response.data.user
  }

  async submitTicket({
    message,
    subject,
    requesterId,
    requester,
    tags = [],
    customFields = [],
    brandId,
    ticketFormId,
  }: SubmitTicketInput): Promise<boolean> {
    const newTicket = JSON.stringify({
      ticket: {
        requester_id: requesterId,
        requester,
        subject: subject?.trim() ?? '',
        comment: { body: message ?? '' },
        tags,
        custom_fields: customFields,
        brand_id: brandId,
        ticket_form_id: ticketFormId,
      },
    })

    try {
      await axios.post(`${this.api}/tickets.json`, newTicket, this.params)
    } catch (e) {
      const errMsg = 'Failed to submit Zendesk ticket'
      const description = e.response.data.description

      this.logger.error(errMsg, {
        message: description,
      })

      throw new Error(`${errMsg}: ${description}`)
    }

    return true
  }

  async searchTickets(query: string): Promise<Array<Ticket>> {
    const allResults: Array<Ticket> = []
    let url: string | null = `${
      this.api
    }/search.json?per_page=10&query=${encodeURIComponent(query)}`

    try {
      while (url) {
        const response: AxiosResponse<{
          results: Array<Ticket>
          next_page?: string | null
        }> = await axios.get(url, this.params)
        allResults.push(...response.data.results)
        url = response.data.next_page ?? null
      }
    } catch (e) {
      const errMsg = 'Failed to search Zendesk tickets'
      const description = e.response?.data?.description ?? e.message
      this.logger.error(errMsg, {
        message: description,
      })
      throw new Error(`${errMsg}: ${description}`)
    }
    return allResults
  }

  async getTicket(ticketId: string): Promise<Ticket> {
    try {
      const response = await axios.get(`${this.api}/tickets/${ticketId}.json`, {
        ...this.params,
      })

      return response.data.ticket
    } catch (e) {
      const errMsg = 'Failed to get Zendesk ticket'
      const description = e.response.data.description

      this.logger.error(errMsg, {
        message: description,
      })

      throw new Error(`${errMsg}: ${description}`)
    }
  }

  async updateTicket(
    ticketId: string,
    values: UpdateTicketBody,
  ): Promise<boolean> {
    const updatedTicket = JSON.stringify({
      ticket: values,
    })

    try {
      await axios.put(
        `${this.api}/tickets/${ticketId}.json`,
        updatedTicket,
        this.params,
      )
    } catch (e) {
      const errMsg = 'Failed to update Zendesk ticket'
      const description = e.response.data.description

      this.logger.error(errMsg, {
        message: description,
      })

      throw new Error(`${errMsg}: ${description}`)
    }

    return true
  }

  async getCustomObjectRecord(
    objectKey: string,
    externalId: string,
  ): Promise<CustomObjectRecord | null> {
    try {
      const response = await axios.get(
        `${this.api}/custom_objects/${objectKey}/records/${externalId}`,
        this.params,
      )
      return response.data.custom_object_record
    } catch (e) {
      if (e.response?.status === 404) return null
      const errMsg = 'Failed to get Zendesk custom object record'
      const description = e.response?.data?.description ?? e.message
      this.logger.error(errMsg, { message: description })
      throw new Error(`${errMsg}: ${description}`)
    }
  }

  async createCustomObjectRecord(
    objectKey: string,
    record: CustomObjectRecord,
  ): Promise<void> {
    try {
      await axios.post(
        `${this.api}/custom_objects/${objectKey}/records`,
        JSON.stringify({ custom_object_record: record }),
        this.params,
      )
    } catch (e) {
      const errMsg = 'Failed to create Zendesk custom object record'
      const description = e.response?.data?.description ?? e.message
      this.logger.error(errMsg, { message: description })
      throw new Error(`${errMsg}: ${description}`)
    }
  }

  async bulkCreateCustomObjectRecords(
    objectKey: string,
    records: CustomObjectRecord[],
  ): Promise<void> {
    try {
      await axios.post(
        `${this.api}/custom_objects/${objectKey}/jobs`,
        JSON.stringify({
          job: {
            action: 'create_many',
            items: records.map((r) => ({ custom_object_record: r })),
          },
        }),
        this.params,
      )
    } catch (e) {
      const errMsg = 'Failed to bulk create Zendesk custom object records'
      const description = e.response?.data?.description ?? e.message
      this.logger.error(errMsg, { message: description })
      throw new Error(`${errMsg}: ${description}`)
    }
  }
}
