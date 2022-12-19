import fetch, { Response } from 'node-fetch'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Result, ServiceResponse, FetchResponse } from './smartSolutions.types'
import {
  DynamicBarcodeDataInput,
  Pass,
  PassDataInput,
  PassStatus,
  PassTemplate,
} from '../../gen/schema'
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
          serviceCode: 2,
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

      return {
        error: {
          serviceCode: 2,
          message: 'Response object not ok',
          httpStatus: {
            status: res.status,
            statusText: res.statusText,
          },
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
          serviceCode: 3,
          message: 'Json parse failure',
        },
      }
    }
    return { data: json as T }
  }

  async listPkPasses(queryId: string): Promise<Result<Pass[]>> {
    if (!this.config.passTemplateId) {
      return {
        ok: false,
        error: {
          serviceCode: 1,
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

    const response = await this.fetchData<
      ServiceResponse<{ passes?: { data: Array<Pass> } }>
    >(graphql)

    if (response.data) {
      return {
        ok: true,
        data: response.data.data?.passes?.data ?? [],
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
        serviceCode: 99,
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

    const response = await this.fetchData<
      ServiceResponse<{ updateStatusOnPassWithDynamicBarcode?: Pass }>
    >(graphql)

    if (response.data) {
      const pass = response?.data?.data?.updateStatusOnPassWithDynamicBarcode
      if (!pass) {
        this.logger.warn('Missing data from verify response', {
          category: LOG_CATEGORY,
        })
        return {
          ok: false,
          error: {
            serviceCode: 5,
            message: 'Missing data',
          },
        }
      }

      //Successful!
      return {
        ok: true,
        data: {
          valid: true,
          ...pass,
        },
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
        serviceCode: 99,
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

    const response = await this.fetchData<
      ServiceResponse<{ upsertPass: Pass }>
    >(graphql)

    if (response.data?.data) {
      return {
        ok: true,
        data: response.data.data.upsertPass,
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
        serviceCode: 99,
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

    const response = await this.fetchData<
      ServiceResponse<{ passTemplates?: { data: Array<PassTemplate> } }>
    >(graphql)

    if (response.data) {
      return {
        ok: true,
        data: response.data.data?.passTemplates?.data ?? [],
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
        serviceCode: 99,
        message: 'Unknown error',
      },
    }
  }
}
