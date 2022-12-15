import fetch, { Response } from 'node-fetch'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  VerifyPassResponse,
  ListPassesResponse,
  ServiceErrorResponse,
  UpsertPassResponse,
  PassTemplatesResponse,
  UpsertPassResult,
  VerifyPassResult,
  ListPassResult,
  VerifyPassServiceStatusCode,
  GeneratePassResult,
} from './smartSolutions.types'
import {
  DynamicBarcodeDataInput,
  PassDataInput,
  PassStatus,
} from '../../gen/schema'
import { ErrorMessageToStatusCodeMap, MapError } from './utils'
import { Inject } from '@nestjs/common'
import { SMART_SOLUTIONS_API_CONFIG } from './smartSolutions.config'
/** Category to attach each log message to */
const LOG_CATEGORY = 'smartsolutions'

export interface SmartSolutionsConfig {
  apiKey: string
  apiUrl: string
  passTemplateId?: string
}

export class SmartSolutionsApi {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(SMART_SOLUTIONS_API_CONFIG)
    private config: SmartSolutionsConfig,
  ) {}

  private fetchUrl(payload: string): Promise<Response> {
    return fetch(this.config.apiUrl, {
      method: 'POST',
      headers: {
        'X-API-KEY': this.config.apiKey,
        'Content-Type': 'application/json',
      },
      body: payload,
    })
  }

  async listPkPasses(queryId: string): Promise<ListPassResult | null> {
    if (!this.config.passTemplateId) {
      this.logger.warn('Missing pass template id!', {
        category: LOG_CATEGORY,
      })
      return null
    }

    const listPassesQuery = `
      query ListPasses {
        passes(
          search: { query: "${queryId}" },
          passTemplateId: "${this.config.passTemplateId}",
          order: { column: WHEN_MODIFIED, dir: DESC }
          ) {
          data {
            whenCreated
            whenModified
            passTemplate {
                id
            }
            distributionUrl
            distributionQRCode
            id
            status
            inputFieldValues {
              passInputField {
                identifier
              }
              value
            }
          }
        }
      }
    `
    let res: Response | null = null

    const graphql = JSON.stringify({
      query: listPassesQuery,
      variables: {},
    })

    try {
      res = await this.fetchUrl(graphql)
    } catch (e) {
      this.logger.warn('Unable to retrieve pk passes', {
        exception: e,
        category: LOG_CATEGORY,
      })
    }

    if (!res) {
      this.logger.warn('Unable to get pk passes, null from fetch', {
        category: LOG_CATEGORY,
      })
      return null
    }

    if (!res.ok) {
      const responseErrors: ServiceErrorResponse = {}
      try {
        const json = await res.json()
        responseErrors.message = json?.message ?? undefined
        responseErrors.status = json?.status ?? undefined
        responseErrors.data = json?.data ?? undefined
      } catch {
        // noop
      }

      this.logger.warn('Expected 200 status for list pkpasses', {
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
      this.logger.warn('Unable to parse JSON for pk passes', {
        exception: e,
        category: LOG_CATEGORY,
      })
      return null
    }

    const response = json as ListPassesResponse

    if (!response?.errors) {
      const passesResult: ListPassResult = {
        type: 'list-passes',
        data: response?.data?.passes?.data ?? undefined,
      }
      return passesResult
    }

    const responseErrors: ServiceErrorResponse = {}
    const resError = response.errors[0]

    responseErrors.message = resError.message ?? undefined
    responseErrors.data = JSON.stringify(res) ?? undefined
    responseErrors.status = MapError(resError.message) ?? undefined

    return {
      type: 'list-passes',
      error: {
        statusCode: res.status,
        serviceError: responseErrors,
      },
    }
  }

  async verifyPkPass(
    payload: DynamicBarcodeDataInput,
  ): Promise<VerifyPassResult | null> {
    const verifyPkPassMutation = `
      mutation UpdateStatusOnPassWithDynamicBarcode($dynamicBarcodeData: DynamicBarcodeDataInput!) {
        updateStatusOnPassWithDynamicBarcode(dynamicBarcodeData: $dynamicBarcodeData) {
          status
          inputFieldValues {
            passInputField {
              identifier
            }
            value
          }
        }
      }
    `

    const body = {
      query: verifyPkPassMutation,
      variables: {
        dynamicBarcodeData: payload,
      },
    }

    let res: Response | null = null

    try {
      res = await this.fetchUrl(JSON.stringify(body))
    } catch (e) {
      this.logger.warn('Unable to verify pk pass', {
        exception: e,
        category: LOG_CATEGORY,
      })
      return null
    }

    if (!res) {
      this.logger.warn('pkpass verification failed, null from fetch', {
        category: LOG_CATEGORY,
      })
      return null
    }
    if (!res.ok) {
      const responseErrors: ServiceErrorResponse = {}
      try {
        const json = await res.json()
        responseErrors.message = json?.message ?? undefined
        responseErrors.data = json?.data ?? undefined
        responseErrors.status = json?.status ?? undefined
      } catch {
        // noop
      }
      if (!responseErrors.status) {
        this.logger.warn('Expected 200 or 400 status for pkpass verification', {
          status: res.status,
          statusText: res.statusText,
          category: LOG_CATEGORY,
          ...responseErrors,
        })
      }

      return {
        type: 'verify',
        valid: false,
        error: {
          statusCode: res.status,
          serviceError: responseErrors,
        },
      }
    }

    let json: unknown
    try {
      json = await res.json()
    } catch (e) {
      this.logger.warn('Unable to parse JSON for pkpass verification', {
        exception: e,
        category: LOG_CATEGORY,
      })
      return null
    }

    const response = json as VerifyPassResponse
    if (!response.errors) {
      return {
        type: 'verify',
        valid: true,
      }
    }

    const resError = response.errors[0]
    const mappedError =
      resError.message in ErrorMessageToStatusCodeMap
        ? (ErrorMessageToStatusCodeMap[
            resError.message
          ] as VerifyPassServiceStatusCode)
        : (99 as VerifyPassServiceStatusCode)

    if (mappedError) {
      const responseErrors: ServiceErrorResponse = {}

      if (!payload.code || !payload.date) {
        const errorMessage = 'Request contains some field errors'

        responseErrors.message = errorMessage
        responseErrors.data = JSON.stringify(res) ?? undefined
        responseErrors.status =
          (ErrorMessageToStatusCodeMap[
            errorMessage
          ] as VerifyPassServiceStatusCode) ??
          (99 as VerifyPassServiceStatusCode)
      } else {
        responseErrors.message = resError.message ?? undefined
        responseErrors.data = JSON.stringify(res) ?? undefined
        responseErrors.status = mappedError ?? undefined
      }

      return {
        type: 'verify',
        valid: false,
        error: {
          statusCode: res.status,
          serviceError: responseErrors,
        },
      }
    }
    return null
  }

  async upsertPkPass(payload: PassDataInput): Promise<UpsertPassResult | null> {
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
        inputData: {
          passTemplateId: this.config.passTemplateId,
          ...payload,
        },
      },
    }

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
      const responseErrors: ServiceErrorResponse = {}
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
      return null
    }

    const response = json as UpsertPassResponse

    if (response.data.upsertPass) {
      return {
        type: 'upsert',
        data: response.data.upsertPass,
      }
    }
    if (response.errors) {
      const resError = response.errors[0]
      const responseErrors: ServiceErrorResponse = {}

      const errorMessage = resError
        .toString()
        .startsWith('Missing following mandatory')
        ? 'Request contains some field errors'
        : resError.toString()
      const mappedError = MapError(errorMessage)

      responseErrors.message = resError.message ?? undefined
      responseErrors.data = JSON.stringify(res) ?? undefined
      responseErrors.status = mappedError ?? undefined

      return {
        type: 'upsert',
        error: {
          statusCode: res.status,
          serviceError: responseErrors,
        },
      }
    }

    return null
  }

  async generatePkPass(
    payload: PassDataInput,
    nationalId: string,
  ): Promise<GeneratePassResult | null> {
    const existingPasses = await this.listPkPasses(nationalId)

    if (
      existingPasses?.data !== 'No passes found' &&
      existingPasses?.data?.some(
        (p) =>
          p.status === PassStatus.Active || p.status === PassStatus.Unclaimed,
      )
    ) {
      const activePasses = existingPasses?.data.filter(
        (p) => p.status === PassStatus.Active,
      )
      if (activePasses?.length) {
        return {
          type: 'upsert',
          data: activePasses[0],
        }
      }

      const unclaimedPasses = existingPasses?.data?.filter(
        (p) => p.status === PassStatus.Unclaimed,
      )

      if (unclaimedPasses?.length) {
        return {
          type: 'upsert',
          data: unclaimedPasses[0],
        }
      }
    }

    this.logger.debug('No active pkpass found for user, will create a new one')

    const response = await this.upsertPkPass(payload)

    if (response?.error) {
      return {
        type: 'upsert',
        error: response.error,
      }
    }

    if (response?.data) {
      return {
        type: 'upsert',
        data: response.data,
      }
    }

    return null
  }

  async generatePkPassQrCode(
    payload: PassDataInput,
    nationalId: string,
  ): Promise<string | null> {
    let pass
    const response = await this.generatePkPass(payload, nationalId)
    if (response?.type == 'list-passes') {
      pass =
        response.data !== 'No passes found'
          ? response.data?.[0].distributionQRCode
          : null
    } else {
      pass = response?.data?.distributionQRCode
    }
    return pass ?? null
  }

  async generatePkPassUrl(
    payload: PassDataInput,
    nationalId: string,
  ): Promise<string | null> {
    let pass
    const response = await this.generatePkPass(payload, nationalId)
    if (response?.type == 'list-passes') {
      pass =
        response.data !== 'No passes found'
          ? response.data?.[0].distributionUrl
          : null
    } else {
      pass = response?.data?.distributionUrl
    }
    return pass ?? null
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
      this.logger.warn('Unable to retrieve pk pass templates', {
        exception: e,
        category: LOG_CATEGORY,
      })
    }

    if (!res) {
      this.logger.warn('Unable to get pkpass templates, null from fetch', {
        category: LOG_CATEGORY,
      })
      return null
    }

    if (!res.ok) {
      const responseErrors: ServiceErrorResponse = {}
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

    if (response?.data.passTemplates) {
      const passTemplates: PassTemplatesResponse = {
        data: response.data,
      }
      return passTemplates
    }

    return null
  }
}
