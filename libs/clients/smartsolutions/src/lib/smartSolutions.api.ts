import fetch, { Response } from 'node-fetch'
import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  PkPassIssuer,
  PassTemplatesResponse,
  PkPassServiceErrorResponse,
  UpsertPkPassResponse,
  PassTemplatesDTO,
} from './smartSolutions.types'
import { ConfigType } from '@nestjs/config'
import { SmartSolutionsClientConfig } from './smartsolutionsApi.config'
import { Pass, PassDataInput } from '../../gen/schema'
/** Category to attach each log message to */
const LOG_CATEGORY = 'smartsolutions'

@Injectable()
export class SmartSolutionsApi {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @Inject(SmartSolutionsClientConfig.KEY)
    private config: ConfigType<typeof SmartSolutionsClientConfig>,
  ) {}

  private getApiKey(issuer: PkPassIssuer) {
    if (process.env.NODE_ENV === 'development')
      return this.config.pkPassApiKeys.veApiKey

    switch (issuer) {
      case PkPassIssuer.RIKISLOGREGLUSTJORI:
        return this.config.pkPassApiKeys.rlsApiKey
      case PkPassIssuer.VINNUEFTIRLITID:
        return this.config.pkPassApiKeys.veApiKey
      default:
        return
    }
  }

  private fetchUrl(payload: string, issuer: PkPassIssuer): Promise<Response> {
    const apiKey = this.getApiKey(issuer)

    if (!apiKey) {
      throw new Error('Invalid Apikey')
    }

    return fetch(this.config.pkPassApiUrl, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: payload,
    })
  }

  async upsertPkPass(
    payload: PassDataInput,
    issuer: PkPassIssuer,
  ): Promise<Pass | null> {
    const createPkPassMutation = `
      mutation UpsertPass($inputData: PassDataInput!) {
        upsertPass(data: $inputData) {
          distributionUrl
          deliveryPageUrl
          distributionQRCode
        }
      }
    `

    const body = {
      query: createPkPassMutation,
      variables: {
        inputData: payload,
      },
    }

    let res: Response | null = null

    try {
      res = await this.fetchUrl(JSON.stringify(body), issuer)
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

    if (response.data?.upsertPass) {
      return response.data.upsertPass
    }

    return null
  }

  async generatePkPassQrCode(payload: PassDataInput, issuer: PkPassIssuer) {
    const pass = await this.upsertPkPass(payload, issuer)
    return pass?.distributionQRCode
  }

  async generatePkPassUrl(payload: PassDataInput, issuer: PkPassIssuer) {
    const pass = await this.upsertPkPass(payload, issuer)
    return pass?.deliveryPageUrl
  }

  async listTemplates(issuer: PkPassIssuer): Promise<PassTemplatesDTO | null> {
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
      res = await this.fetchUrl(JSON.stringify(listTemplatesQuery), issuer)
    } catch (e) {
      this.logger.warn('Unable to retreive pk pass templates', {
        exception: e,
        category: LOG_CATEGORY,
      })
      return null
    }

    if (!res) {
      this.logger.warn('Unable to get pkpass templates, null from fetch', {
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
      this.logger.warn('Unable to parse JSON for list templates', {
        exception: e,
        category: LOG_CATEGORY,
      })
      //return null
    }

    const response = json as PassTemplatesResponse

    if (response?.data?.passTemplates?.data) {
      const passTemplatesDto: PassTemplatesDTO = {
        passTemplates: response.data.passTemplates.data,
      }
      return passTemplatesDto
    }

    return null
  }
}
