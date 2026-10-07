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
  externalId?: string
}

export type User = {
  name: string
  email: string
  id: number
}

export type CustomObjectRecord = {
  id: string
  name: string
  external_id: string
  custom_object_fields?: Record<string, unknown>
}

export type CustomObjectJobItem = {
  name: string
  external_id: string
  custom_object_fields?: Record<string, unknown>
}

export type JobStatusResult = {
  index?: number
  id?: string | number
  external_id?: string
  status?: string
  error?: string
  errors?: Array<{ code?: string; title?: string; detail?: string }>
}

type JobStatus = {
  id: string
  url?: string
  status: 'queued' | 'working' | 'completed' | 'failed' | 'aborted'
  results?: Array<JobStatusResult>
}

export type Ticket = {
  id: string
  status: TicketStatus | string
  custom_fields: Array<{ id: number; value: string }>
  tags: Array<string>
  description?: string
  external_id?: string | null
}

const isFailedJobResult = (result: JobStatusResult) =>
  result.status?.toLowerCase() === 'failed' ||
  Boolean(result.error) ||
  (Array.isArray(result.errors)
    ? result.errors.length > 0
    : Boolean(result.errors))

export interface ZendeskServiceOptions {
  email: string
  token: string
  subdomain: string
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

  async submitTicket(input: SubmitTicketInput): Promise<boolean> {
    await this.createTicket(input)
    return true
  }

  private toTicketBody({
    message,
    subject,
    requesterId,
    requester,
    tags = [],
    customFields = [],
    brandId,
    ticketFormId,
    externalId,
  }: SubmitTicketInput) {
    return {
      requester_id: requesterId,
      requester,
      subject: subject?.trim() ?? '',
      comment: { body: message ?? '' },
      tags,
      custom_fields: customFields,
      brand_id: brandId,
      ticket_form_id: ticketFormId,
      external_id: externalId,
    }
  }

  async createTicket(input: SubmitTicketInput): Promise<Ticket | undefined> {
    const newTicket = JSON.stringify({ ticket: this.toTicketBody(input) })

    try {
      const response = await axios.post(
        `${this.api}/tickets.json`,
        newTicket,
        this.params,
      )
      const ticket = response.data?.ticket

      if (!ticket?.id) {
        this.logger.warn('Zendesk ticket response is missing the ticket id')
        return undefined
      }

      return ticket
    } catch (e) {
      const errMsg = 'Failed to submit Zendesk ticket'
      const description = e.response?.data?.description ?? e.message

      this.logger.error(errMsg, {
        message: description,
      })

      throw new Error(`${errMsg}: ${description}`)
    }
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

  async upsertCustomObjectRecord(
    objectKey: string,
    record: CustomObjectJobItem,
  ): Promise<CustomObjectRecord> {
    const body = JSON.stringify({ custom_object_record: record })
    try {
      const response = await axios.patch(
        `${
          this.api
        }/custom_objects/${objectKey}/records?external_id=${encodeURIComponent(
          record.external_id,
        )}`,
        body,
        this.params,
      )
      return response.data.custom_object_record
    } catch (e) {
      const errMsg = 'Failed to upsert Zendesk custom object record'
      const description = e.response?.data?.description ?? e.message
      this.logger.error(errMsg, { message: description })
      throw new Error(`${errMsg}: ${description}`)
    }
  }

  /**
   * Upserts records by external id in a single bulk job (max 100 items).
   * Zendesk bulk jobs are not atomic, so this throws if any item failed and
   * the caller is responsible for cleaning up the items that were written.
   */
  async upsertCustomObjectRecordsByExternalId(
    objectKey: string,
    items: CustomObjectJobItem[],
  ): Promise<void> {
    const results = await this.runJob(
      `${this.api}/custom_objects/${objectKey}/jobs`,
      { job: { action: 'create_or_update_by_external_id', items } },
      'Zendesk custom object upsert job',
    )

    const failed = results.filter(isFailedJobResult)
    if (failed.length > 0) {
      throw new Error(
        `${failed.length} Zendesk custom object job item(s) failed: ${failed
          .map((r) => r.external_id ?? r.index)
          .join(', ')}`,
      )
    }
  }

  /**
   * Deletes records by external id in a single bulk job (max 100 items).
   * Records that do not exist are treated as already deleted.
   */
  async deleteCustomObjectRecordsByExternalId(
    objectKey: string,
    externalIds: string[],
  ): Promise<void> {
    const results = await this.runJob(
      `${this.api}/custom_objects/${objectKey}/jobs`,
      { job: { action: 'delete_by_external_id', items: externalIds } },
      'Zendesk custom object delete job',
    )

    const failed = results.filter(
      (r) =>
        isFailedJobResult(r) &&
        !r.errors?.some((e) => e.title === 'Record not found'),
    )
    if (failed.length > 0) {
      throw new Error(
        `${failed.length} Zendesk custom object delete item(s) failed: ${failed
          .map((r) => r.external_id ?? r.index)
          .join(', ')}`,
      )
    }
  }

  async listCustomObjectRecordsByExternalIds(
    objectKey: string,
    externalIds: string[],
  ): Promise<CustomObjectRecord[]> {
    const records: CustomObjectRecord[] = []
    let url: string | null = `${
      this.api
    }/custom_objects/${objectKey}/records?page[size]=100&filter[external_ids]=${externalIds
      .map(encodeURIComponent)
      .join(',')}`

    try {
      while (url) {
        const response: AxiosResponse<{
          custom_object_records: CustomObjectRecord[]
          meta?: { has_more?: boolean }
          links?: { next?: string | null }
        }> = await axios.get(url, this.params)
        records.push(...response.data.custom_object_records)
        // links.next is set even on the last page
        url = response.data.meta?.has_more
          ? response.data.links?.next ?? null
          : null
      }
    } catch (e) {
      const errMsg = 'Failed to list Zendesk custom object records'
      const description = e.response?.data?.description ?? e.message
      this.logger.error(errMsg, { message: description })
      throw new Error(`${errMsg}: ${description}`)
    }

    return records
  }

  /**
   * Returns every record matching the filter, see
   * https://developer.zendesk.com/api-reference/custom-data/custom-objects/custom_object_records/#filtered-search-of-custom-object-records
   */
  async searchCustomObjectRecords(
    objectKey: string,
    filter: Record<string, unknown>,
  ): Promise<CustomObjectRecord[]> {
    const records: CustomObjectRecord[] = []
    const body = JSON.stringify({ filter })
    let after: string | null = null

    try {
      do {
        const response: AxiosResponse<{
          custom_object_records: CustomObjectRecord[]
          meta?: { has_more?: boolean; after_cursor?: string | null }
        }> = await axios.post(
          `${
            this.api
          }/custom_objects/${objectKey}/records/search?page[size]=100${
            after ? `&page[after]=${encodeURIComponent(after)}` : ''
          }`,
          body,
          this.params,
        )
        records.push(...response.data.custom_object_records)
        after = response.data.meta?.has_more
          ? response.data.meta.after_cursor ?? null
          : null
      } while (after)
    } catch (e) {
      const errMsg = 'Failed to search Zendesk custom object records'
      const description = e.response?.data?.description ?? e.message
      this.logger.error(errMsg, { message: description })
      throw new Error(`${errMsg}: ${description}`)
    }

    return records
  }

  async getTicketByExternalId(externalId: string): Promise<Ticket | null> {
    try {
      const response = await axios.get<{ tickets: Ticket[] }>(
        `${this.api}/tickets.json?external_id=${encodeURIComponent(
          externalId,
        )}`,
        this.params,
      )
      return response.data.tickets[0] ?? null
    } catch (e) {
      const errMsg = 'Failed to get Zendesk ticket by external id'
      const description = e.response?.data?.description ?? e.message
      this.logger.error(errMsg, { message: description })
      throw new Error(`${errMsg}: ${description}`)
    }
  }

  /**
   * Creates up to 100 tickets in a single bulk job. The job is not atomic,
   * so the returned array holds the created ticket id for each input (by
   * index) or undefined where that ticket could not be created.
   */
  async createManyTickets(
    inputs: SubmitTicketInput[],
  ): Promise<Array<number | undefined>> {
    const results = await this.runJob(
      `${this.api}/tickets/create_many.json`,
      { tickets: inputs.map((input) => this.toTicketBody(input)) },
      'Zendesk create many tickets job',
    )

    const ticketIds: Array<number | undefined> = inputs.map(() => undefined)
    results.forEach((result, position) => {
      const index = result.index ?? position
      const id = Number(result.id)
      if (!isFailedJobResult(result) && Number.isSafeInteger(id) && id > 0) {
        ticketIds[index] = id
      }
    })

    return ticketIds
  }

  /**
   * Queues a bulk job and waits for it to complete, returning its per item
   * results. Throws if the job cannot be queued, fails as a whole or does
   * not complete in time.
   */
  private async runJob(
    url: string,
    body: unknown,
    jobName: string,
  ): Promise<JobStatusResult[]> {
    let jobStatus: JobStatus
    try {
      const response = await axios.post(url, JSON.stringify(body), this.params)
      jobStatus = response.data.job_status ?? response.data
    } catch (e) {
      const errMsg = `Failed to create ${jobName}`
      const description = e.response?.data?.description ?? e.message
      this.logger.error(errMsg, { message: description })
      throw new Error(`${errMsg}: ${description}`)
    }

    // Jobs are queued, in practice they take around 10 seconds to complete
    const MAX_POLL_ATTEMPTS = 60
    const POLL_INTERVAL_MS = 1000

    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
      if (jobStatus.status === 'completed') break
      if (jobStatus.status === 'failed' || jobStatus.status === 'aborted') {
        throw new Error(`${jobName} ${jobStatus.status}: ${jobStatus.id}`)
      }

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))

      try {
        const pollUrl =
          jobStatus.url ?? `${this.api}/job_statuses/${jobStatus.id}.json`
        const response = await axios.get(pollUrl, this.params)
        jobStatus = response.data.job_status ?? response.data
      } catch (e) {
        const errMsg = `Failed to poll ${jobName} status`
        const description = e.response?.data?.description ?? e.message
        this.logger.error(errMsg, { message: description })
        throw new Error(`${errMsg}: ${description}`)
      }
    }

    if (jobStatus.status !== 'completed') {
      throw new Error(`${jobName} did not complete in time: ${jobStatus.id}`)
    }

    return jobStatus.results ?? []
  }
}
