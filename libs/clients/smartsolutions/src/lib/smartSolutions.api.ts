import fetch, { Response } from 'node-fetch'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  UpsertPkPassResponse,
  PassTemplatesDTO,
  PkPassServiceErrorResponse,
  ListPassesDTO,
  VerifyPassResponse,
  ListPassesResponse,
  VerifyPassResult,
  PkPassServiceVerifyPassStatusCode,
} from './smartSolutions.types'
import {
  DynamicBarcodeDataInput,
  Pass,
  PassDataInput,
  PassStatus,
  PassTemplatePageInfo,
} from '../../gen/schema'
import { ErrorMessageToStatusCodeMap } from './utils'
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

  async listPkPasses(queryId: string): Promise<ListPassesDTO | null> {
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
      const responseErrors: PkPassServiceErrorResponse = {}
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
      //return null
    }

    const response = json as ListPassesResponse

    if (response?.data?.passes?.data) {
      const passesDTO: ListPassesDTO = {
        data: response.data.passes.data,
      }
      return passesDTO
    }

    return null
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
      const responseErrors: PkPassServiceErrorResponse = {}
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
        valid: true,
      }
    }

    const resError = response.errors[0]
    const mappedError =
      resError.message in ErrorMessageToStatusCodeMap
        ? (ErrorMessageToStatusCodeMap[
            resError.message
          ] as PkPassServiceVerifyPassStatusCode)
        : (99 as PkPassServiceVerifyPassStatusCode)

    if (mappedError) {
      const responseErrors: PkPassServiceErrorResponse = {}

      if (!payload.code || !payload.date) {
        const errorMessage = 'Request contains some field errors'

        responseErrors.message = errorMessage
        responseErrors.data = JSON.stringify(res) ?? undefined
        responseErrors.status =
          (ErrorMessageToStatusCodeMap[
            errorMessage
          ] as PkPassServiceVerifyPassStatusCode) ??
          (99 as PkPassServiceVerifyPassStatusCode)
      } else {
        responseErrors.message = resError.message ?? undefined
        responseErrors.data = JSON.stringify(res) ?? undefined
        responseErrors.status = mappedError ?? undefined
      }

      return {
        valid: false,
        error: {
          statusCode: res.status,
          serviceError: responseErrors,
        },
      }
    }
    return null
  }

  async upsertPkPass(
    payload: PassDataInput,
  ): Promise<UpsertPkPassResponse | null> {
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
      return null
    }

    const response = json as UpsertPkPassResponse

    if (response) {
      return response
    }

    return null
  }

  async generatePkPass(
    payload: PassDataInput,
    nationalId: string,
  ): Promise<Pass | null> {
    const existingPasses = await this.listPkPasses(nationalId)

    const containsActiveOrUnclaimed =
      existingPasses?.data &&
      existingPasses?.data.some(
        (p) =>
          p.status === PassStatus.Active || p.status === PassStatus.Unclaimed,
      )

    if (containsActiveOrUnclaimed) {
      const activePasses = existingPasses?.data.filter(
        (p) => p.status === PassStatus.Active,
      )
      if (activePasses?.length) {
        return activePasses[0]
      }

      const unclaimedPasses = existingPasses?.data.filter(
        (p) => p.status === PassStatus.Unclaimed,
      )

      if (unclaimedPasses?.length) {
        return unclaimedPasses[0]
      }
    }

    const response = await this.upsertPkPass(payload)

    if (response?.data?.upsertPass) {
      return response?.data?.upsertPass
    }

    this.logger.warn(
      'the pkpass service response did not include a generated pass',
      {
        serviceStatus: response?.status,
        serviceMessage: response?.message,
        category: LOG_CATEGORY,
      },
    )

    return null
  }

  async generatePkPassQrCode(
    payload: PassDataInput,
    nationalId: string,
  ): Promise<string | null> {
    const pkPass = await this.generatePkPass(payload, nationalId)
    return pkPass?.distributionQRCode ?? null
  }

  async generatePkPassUrl(
    payload: PassDataInput,
    nationalId: string,
  ): Promise<string | null> {
    const pkPass = await this.generatePkPass(payload, nationalId)
    return pkPass?.distributionUrl ?? null
  }

  async listTemplates(): Promise<PassTemplatesDTO | null> {
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

    const response = json as PassTemplatePageInfo

    if (response?.data) {
      const passTemplatesDto: PassTemplatesDTO = {
        data: response.data,
      }
      return passTemplatesDto
    }

    return null
  }
}
