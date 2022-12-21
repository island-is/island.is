import fetch, { Response } from 'node-fetch'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  Result,
  ApiResponse,
  FetchResponse,
  ServiceErrorCode,
} from './smartSolutions.types'
import {
  DynamicBarcodeDataInput,
  Pass,
  PassDataInput,
  PassStatus,
  PassTemplate,
} from '../../gen/schema'
import { Inject } from '@nestjs/common'
import { SMART_SOLUTIONS_API_CONFIG } from './smartSolutions.config'
import { ErrorMessageToVerifyStatusCodeMap } from './utils'
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

  private async fetchData<T>(query: string): Promise<FetchResponse<T>> {
    let res: Response | null = null
    try {
      res = await this.fetchUrl(query)
    } catch (e) {
      this.logger.warn('Unable to fetch data', {
        exception: e,
        category: LOG_CATEGORY,
      })
    }

    if (!res) {
      this.logger.warn('Unable to query data, null from fetch', {
        category: LOG_CATEGORY,
      })

      return {
        error: {
          code: 11,
          message: 'Service error',
        },
      }
    }

    if (!res.ok) {
      this.logger.warn('Expected 200 status after fetch', {
        status: res.status,
        statusText: res.statusText,
        category: LOG_CATEGORY,
      })

      if (!res.status) {
        this.logger.warn('Expected 200 status', {
          status: res.status,
          statusText: res.statusText,
          category: LOG_CATEGORY,
        })
      }

      return {
        error: {
          code: res.status,
          message: res.statusText,
          data: JSON.stringify(res),
        },
      }
    }

    let json: unknown
    try {
      json = await res.json()
    } catch (e) {
      this.logger.warn('Unable to parse JSON', {
        exception: e,
        category: LOG_CATEGORY,
      })
      return {
        error: {
          code: 12,
          message: 'JSON parse failure',
        },
      }
    }

    return { apiResponse: json as ApiResponse<T> }
  }

  async listPkPasses(queryId: string): Promise<Result<Pass[]>> {
    if (!this.config.passTemplateId) {
      return {
        ok: false,
        error: {
          code: 10,
          message: 'Service error',
        },
      }
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

    const graphql = JSON.stringify({
      query: listPassesQuery,
      variables: {},
    })

    const response = await this.fetchData<{ passes?: { data: Array<Pass> } }>(
      graphql,
    )

    if (response.apiResponse) {
      return {
        ok: true,
        data: response.apiResponse.data?.passes?.data ?? [],
      }
    }

    if (response.error) {
      return {
        ok: false,
        error: response.error,
      }
    }

    return {
      ok: false,
      error: {
        code: 99,
        message: 'Unknown error',
      },
    }
  }

  async verifyPkPass(
    payload: DynamicBarcodeDataInput,
  ): Promise<Result<Pass & { valid: boolean }>> {
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

    const graphql = JSON.stringify({
      query: verifyPkPassMutation,
      variables: {
        dynamicBarcodeData: payload,
      },
    })

    const response = await this.fetchData<{
      updateStatusOnPassWithDynamicBarcode?: Pass
    }>(graphql)

    //If the fetch returned a response from the service
    if (response.apiResponse) {
      const apiRes = response.apiResponse

      //If the api itself returned an error
      if (apiRes.errors) {
        const resError = apiRes.errors[0]
        const mappedError =
          resError.message in ErrorMessageToVerifyStatusCodeMap
            ? (ErrorMessageToVerifyStatusCodeMap[
                resError.message
              ] as ServiceErrorCode)
            : (99 as ServiceErrorCode)

        return {
          ok: false,
          error: {
            code: mappedError,
            message: resError.message,
            data: JSON.stringify(resError),
          },
        }
      }
      //else, some the api return some business data
      const pass = apiRes.data?.updateStatusOnPassWithDynamicBarcode

      //The api should always return the pass
      if (!pass) {
        return {
          ok: false,
          error: {
            code: 13,
            data: JSON.stringify(apiRes),
            message: 'Service error',
          },
        }
      }

      //sweet success
      return {
        ok: true,
        data: {
          valid: true,
          ...pass,
        },
      }
    }

    //if the fetch returned a service error
    if (response.error) {
      return {
        ok: false,
        error: response.error,
      }
    }

    //catchall
    return {
      ok: false,
      error: {
        code: 99,
        message: 'Unknown error',
      },
    }
  }

  async upsertPkPass(payload: PassDataInput): Promise<Result<Pass>> {
    const createPkPassMutation = `
      mutation UpsertPass($inputData: PassDataInput!) {
        upsertPass(data: $inputData) {
          distributionUrl
          deliveryPageUrl
          distributionQRCode
        }
      }
    `

    const graphql = JSON.stringify({
      query: createPkPassMutation,
      variables: {
        inputData: {
          passTemplateId: this.config.passTemplateId,
          ...payload,
        },
      },
    })

    const response = await this.fetchData<{ upsertPass: Pass }>(graphql)

    if (response.apiResponse?.data) {
      return {
        ok: true,
        data: response.apiResponse.data.upsertPass,
      }
    }

    if (response.error) {
      return {
        ok: false,
        error: response.error,
      }
    }

    return {
      ok: false,
      error: {
        code: 99,
        message: 'Unknown error',
      },
    }
  }

  async generatePkPass(
    payload: PassDataInput,
    nationalId: string,
  ): Promise<Result<Pass>> {
    const existingPasses = await this.listPkPasses(nationalId)

    if (
      existingPasses?.ok &&
      existingPasses?.data.some(
        (p) =>
          p.status === PassStatus.Active || p.status === PassStatus.Unclaimed,
      )
    ) {
      const activePasses = existingPasses?.data.filter(
        (p) => p.status === PassStatus.Active,
      )
      if (activePasses?.length) {
        return {
          ok: existingPasses.ok,
          //return the most recent active pass
          data: activePasses[0],
        }
      }

      const unclaimedPasses = existingPasses?.data?.filter(
        (p) => p.status === PassStatus.Unclaimed,
      )

      if (unclaimedPasses?.length) {
        return {
          ok: existingPasses.ok,
          //return the most recent unclaimed pass
          data: unclaimedPasses[0],
        }
      }
    }

    this.logger.debug('No active pkpass found for user, creating a new one')

    const pass = await this.upsertPkPass(payload)
    //const pass = await this.upsertPkPass({})
    return pass
  }

  async generatePkPassQrCode(
    payload: PassDataInput,
    nationalId: string,
  ): Promise<Result<string>> {
    const response = await this.generatePkPass(payload, nationalId)
    if (response.ok) {
      return {
        ok: true,
        data: response.data.distributionQRCode,
      }
    }

    return response
  }

  async generatePkPassUrl(
    payload: PassDataInput,
    nationalId: string,
  ): Promise<Result<string>> {
    const response = await this.generatePkPass(payload, nationalId)
    if (response.ok) {
      return {
        ok: true,
        data: response.data.distributionUrl,
      }
    }
    return response
  }

  async listTemplates(): Promise<Result<Array<PassTemplate>>> {
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

    const graphql = JSON.stringify({
      query: listTemplatesQuery,
      variables: {},
    })

    const response = await this.fetchData<{
      passTemplates?: { data: Array<PassTemplate> }
    }>(graphql)

    if (response.apiResponse?.data) {
      return {
        ok: true,
        data: response.apiResponse.data?.passTemplates?.data ?? [],
      }
    }

    if (response.error) {
      return {
        ok: false,
        error: response.error,
      }
    }

    return {
      ok: false,
      error: {
        code: 99,
        message: 'Unknown error',
      },
    }
  }
}
