import fetch, { Response } from 'node-fetch'
import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  CreatePkPassDataInput,
  PassTemplatesResponse,
  PkPassServiceErrorResponse,
  UpsertPkPassResponse,
} from './smartSolutions.types'
import { User } from '../../gen/schema'
/** Category to attach each log message to */
const LOG_CATEGORY = 'smartsolutions'

@Injectable()
export class SmartSolutionsApi {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {}

  private fetchUrl(payload: string): Promise<Response> {
    return fetch(`https://smartpages-api.smartsolutions.is/graphql`, {
      method: 'POST',
      headers: {
        'X-API-KEY': '8e772138-c65a-4351-8834-ff13a88299fb',
        'Content-Type': 'application/json',
      },
      body: payload,
    })
  }

  async upsertPkPass(
    payload: CreatePkPassDataInput,
  ): Promise<UpsertPkPassResponse | null> {
    const createPkPassMutation = `
      mutation UpsertPass($inputData: PassDataInput!) {
        upsertPass(data: $inputData) {
          distributionUrl
          deliveryPageUrl
          distributionQRCode
        }
      }
    }`

    const body = {
      query: createPkPassMutation,
      variables: {
        inputData: payload,
      },
    }

    this.logger.debug(body)

    let res: Response | null = null

    try {
      res = await this.fetchUrl(JSON.stringify(body))
    } catch (e) {
      this.logger.warn('Unable to upsert pkpass', {
        exception: e,
        category: LOG_CATEGORY,
      })
      return null
    }

    if (!res) {
      this.logger.warn('No pkpass data retrieved, null from fetch', {
        category: LOG_CATEGORY,
      })
      return null
    }

    if (!res.ok) {
      const responseErrors: PkPassServiceErrorResponse = {}
      try {
        const json = await res.json()
        responseErrors.message = json?.message ?? undefined
        responseErrors.status = json?.status ?? undefined
        responseErrors.data = json?.data ?? undefined
      } catch {
        // noop
      }

      this.logger.warn('Expected 200 status for pkpass upsert', {
        status: res.status,
        statusText: res.statusText,
        category: LOG_CATEGORY,
        ...responseErrors,
      })
      return null
    }

    let json: unknown
    try {
      json = await res.json()
    } catch (e) {
      this.logger.warn('Unable to parse JSON for pkpass upsert', {
        exception: e,
        category: LOG_CATEGORY,
      })
      //return null
    }

    const response = json as UpsertPkPassResponse
    this.logger.debug(JSON.stringify(response))

    if (response.data) {
      return response as UpsertPkPassResponse
    }

    return null
  }

  async generatePkPassQrCode(user: User, payload: CreatePkPassDataInput) {
    const pass = await this.upsertPkPass(payload)
    return pass?.data?.upsertPass?.distributionQRCode ?? null
  }

  async generatePkPassUrl(user: User, payload: CreatePkPassDataInput) {
    const pass = await this.upsertPkPass(payload)
    return pass?.data?.upsertPass?.distributionUrl ?? null
  }

  async listTemplates(): Promise<PassTemplatesResponse | null> {
    const listTemplatesQuery = {
      query: `
        query passTemplateQuery {
          passTemplates {
            data {
              id
              name
            }
          }
        }
      `,
    }

    let res: Response | null = null

    try {
      res = await this.fetchUrl(JSON.stringify(listTemplatesQuery))
    } catch (e) {
      this.logger.warn('Unable to retreive pk pass templates', {
        exception: e,
        category: LOG_CATEGORY,
      })
      return null
    }

    if (!res) {
      this.logger.warn(
        'Unable to get pkpass drivers license, null from fetch',
        {
          category: LOG_CATEGORY,
        },
      )
      return null
    }

    if (!res.ok) {
      const responseErrors: PkPassServiceErrorResponse = {}
      try {
        const json = await res.json()
        responseErrors.message = json?.message ?? undefined
        responseErrors.status = json?.status ?? undefined
        responseErrors.data = json?.data ?? undefined
      } catch {
        // noop
      }

      this.logger.warn('Expected 200 status for list templates', {
        status: res.status,
        statusText: res.statusText,
        category: LOG_CATEGORY,
        ...responseErrors,
      })
      return null
    }

    let json: unknown
    try {
      json = await res.json()
    } catch (e) {
      this.logger.warn('Unable to parse JSON for list templateasservice', {
        exception: e,
        category: LOG_CATEGORY,
      })
      //return null
    }

    const response = json as PassTemplatesResponse
    this.logger.debug(JSON.stringify(response))

    if (response.data) {
      return response as PassTemplatesResponse
    }

    return null
  }
}
