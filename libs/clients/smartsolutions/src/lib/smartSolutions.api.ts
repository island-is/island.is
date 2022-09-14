import fetch, { Response } from 'node-fetch'
import type { Logger } from '@island.is/logging'
import {
  PassTemplatesResponse,
  UpsertPkPassResponse,
  PassTemplatesDTO,
  PkPassServiceErrorResponse,
  ListPassesDTO,
  ListPassesResponse,
  CreatePkPassDataInput,
  VerifyPassResponse,
  DynamicBarcodeDataInput,
  PkPassStatus,
} from './smartSolutions.types'
/** Category to attach each log message to */
const LOG_CATEGORY = 'smartsolutions'

export interface SmartSolutionsConfig {
  apiKey: string
  apiUrl: string
}

export class SmartSolutionsApi {
  constructor(
    private readonly logger: Logger,
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

  async listPkPasses(
    queryId: string,
    passTemplateId: string,
  ): Promise<ListPassesDTO | null> {
    const listPassesQuery = `
      query ListPasses {
        passes(
          search: { query: "${queryId}" },
          passTemplateId: "${passTemplateId}",
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
        passes: response.data.passes.data,
      }
      return passesDTO
    }

    return null
  }

  async verifyPkPass(
    payload: DynamicBarcodeDataInput,
  ): Promise<VerifyPassResponse | null> {
    const verifyPkPassMutation = `
      mutation UpdateStatusOnPassWithDynamicBarcode($dynamicBarcodeData: DynamicBarcodeDataInput!) {
        updateStatusOnPassWithDynamicBarcode(dynamicBarcodeData: $dynamicBarcodeData) {
          id
          validFrom
          expirationDate
          expirationTime
          status
          whenCreated
          whenModified
          alreadyPaid
        }
      }
    `

    const { code, date } = payload.dynamicBarcodeData

    const body = {
      query: verifyPkPassMutation,
      variables: {
        dynamicBarcodeData: {
          code,
          date,
        },
      },
    }

    let res: Response | null = null

    try {
      res = await this.fetchUrl(JSON.stringify(body))
    } catch (e) {
      this.logger.warn('Unable to verify pass', {
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
        responseErrors.status = json?.status ?? undefined
        responseErrors.data = json?.data ?? undefined
      } catch {
        // noop
      }

      this.logger.warn('Expected 200 status for pkpass verification', {
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
      this.logger.warn('Unable to parse JSON for pkpass verification', {
        exception: e,
        category: LOG_CATEGORY,
      })
      //return null
    }

    const response = json as VerifyPassResponse

    if (response) {
      return response
    }

    return null
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
    `

    const body = {
      query: createPkPassMutation,
      variables: {
        inputData: payload,
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
      //return null
    }

    const response = json as UpsertPkPassResponse

    if (response) {
      return response
    }

    return null
  }

  async generatePkPass(payload: CreatePkPassDataInput, nationalId: string) {
    const existingPasses = await this.listPkPasses(
      nationalId,
      payload.passTemplateId ?? '',
    )

    const containsActiveOrUnclaimed =
      existingPasses?.passes &&
      existingPasses.passes.some(
        (p) =>
          p.status === PkPassStatus.Active ||
          p.status === PkPassStatus.Unclaimed,
      )

    if (containsActiveOrUnclaimed) {
      const activePasses = existingPasses?.passes.filter(
        (p) => p.status === PkPassStatus.Active,
      )
      if (activePasses?.length) {
        return activePasses[0]
      }

      const unclaimedPasses = existingPasses?.passes.filter(
        (p) => p.status === PkPassStatus.Unclaimed,
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
    payload: CreatePkPassDataInput,
    nationalId: string,
  ) {
    const pkPass = await this.generatePkPass(payload, nationalId)

    return pkPass?.distributionQRCode ?? ''
  }

  async generatePkPassUrl(payload: CreatePkPassDataInput, nationalId: string) {
    const pkPass = await this.generatePkPass(payload, nationalId)
    return pkPass?.distributionUrl ?? ''
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
