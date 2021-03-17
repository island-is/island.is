import { Inject } from '@nestjs/common'
import axios from 'axios'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

export const ZENDESK_OPTIONS = 'ZENDESK_OPTIONS'

export type Ticket = {
  subject?: string
  message: string
  requesterId?: number
  tags?: Array<string>
}

export type User = {
  name: string
  email: string
  id: number
}

export interface ZendeskOptions {
  email: string
  token: string
  subdomain: string
}

export class ZendeskService {
  #api: string
  #params: object

  constructor(
    @Inject(ZENDESK_OPTIONS)
    private readonly config: ZendeskOptions,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {
    const token = Buffer.from(
      `${this.config.email}/token:${this.config.token}`,
    ).toString('base64')

    this.#api = `https://${config.subdomain}.zendesk.com/api/v2`

    this.#params = {
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
        `${this.#api}/search.json?query=${encodeURIComponent(
          `email:"${email}"`,
        )}`,
        this.#params,
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
        `${this.#api}/users.json`,
        newUser,
        this.#params,
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
    tags = [],
  }: Ticket): Promise<boolean> {
    const newTicket = JSON.stringify({
      ticket: {
        requester_id: requesterId,
        subject: subject?.trim() ?? '',
        comment: { body: message ?? '' },
        tags,
      },
    })

    try {
      await axios.post(`${this.#api}/tickets.json`, newTicket, this.#params)
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
}
