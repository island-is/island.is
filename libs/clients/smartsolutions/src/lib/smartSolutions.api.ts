import fetch, { Response } from 'node-fetch'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  Result,
  ApiResponse,
  FetchResponse,
  ServiceError,
  ListPassesResponseData,
  VerifyPassResponseData,
  VerifyPassData,
  ParsedApiResponse,
  VoidPassData,
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
import {
  MapErrorMessageToActionStatusCode,
  mapPassToPassDataInput,
  mergeInputFields,
} from './utils'

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

  private async fetchData(query: string): Promise<FetchResponse> {
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
          message: 'JSON parse failed',
        },
      }
    }

    return { apiResponse: json as ApiResponse }
  }

  private parseApiResponse<T>(apiRes: ApiResponse): ParsedApiResponse<T> {
    if (apiRes.errors) {
      const resError = apiRes.errors[0]
      const code = MapErrorMessageToActionStatusCode(resError.message)
      const error = {
        code,
        message: resError.message,
        data: JSON.stringify(resError),
      } as ServiceError

      return { error }
    }
    const data = apiRes.data as T

    //shouldn't happen
    if (!data) {
      const error = {
        code: 13,
        data: JSON.stringify(apiRes),
        message: 'Service error',
      }
      return { error }
    }

    return { data }
  }

  private filterExistingPasses(passes: Array<Pass>): Pass | undefined {
    if (
      passes.some(
        (p) =>
          p.status === PassStatus.Active || p.status === PassStatus.Unclaimed,
      )
    ) {
      const activePasses = passes.filter((p) => p.status === PassStatus.Active)
      if (activePasses?.length) {
        return activePasses[0]
      }

      const unclaimedPasses = passes?.filter(
        (p) => p.status === PassStatus.Unclaimed,
      )
      if (unclaimedPasses?.length) {
        return unclaimedPasses[0]
      }
    }
    return
  }

  async getPkPass(query: string, passId: string): Promise<Result<Pass>> {
    const graphql = JSON.stringify({
      query,
      variables: {
        id: passId,
      },
    })

    const response = await this.fetchData(graphql)

    if (response.apiResponse) {
      const apiRes = this.parseApiResponse<{ pass: Pass }>(response.apiResponse)

      if (apiRes.error) {
        return {
          ok: false,
          error: apiRes.error,
        }
      }

      /** No error, so return the data. *
       * If pass = undefined, it means the user currently has no passes */

      return {
        ok: true,
        data: apiRes.data.pass,
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

  async fetchPkPasses(query: string): Promise<Result<Pass[]>> {
    if (!this.config.passTemplateId) {
      return {
        ok: false,
        error: {
          code: 10,
          message: 'Service error',
        },
      }
    }

    const graphql = JSON.stringify({
      query,
      variables: {},
    })

    const response = await this.fetchData(graphql)

    if (response.apiResponse) {
      const apiRes = this.parseApiResponse<ListPassesResponseData>(
        response.apiResponse,
      )

      if (apiRes.error) {
        return {
          ok: false,
          error: apiRes.error,
        }
      }

      /** No error, so return the data. *
       * If pass = undefined, it means the user currently has no passes */

      return {
        ok: true,
        data: apiRes.data.passes?.data ?? [],
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
  ): Promise<Result<VerifyPassData>> {
    //TODO: PULL INTO SEPARATE FOLDER
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

    const response = await this.fetchData(graphql)

    //If the fetch returned a response from the service
    if (response.apiResponse) {
      const parsedApiRes = this.parseApiResponse<VerifyPassResponseData>(
        response.apiResponse,
      )

      if (parsedApiRes.error) {
        return {
          ok: false,
          error: parsedApiRes.error,
        }
      }

      //sweet success
      return {
        ok: true,
        data: {
          valid: true,
          pass: parsedApiRes.data.updateStatusOnPassWithDynamicBarcode,
        },
      }
    }

    //if the fetch returned a service error, return it
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
    if (!this.config.passTemplateId) {
      return {
        ok: false,
        error: {
          code: 10,
          message: 'Service error',
        },
      }
    }

    //TODO: PULL INTO SEPARATE FOLDER
    const upsertPkPassMutation = `
      mutation UpsertPass($inputData: PassDataInput!) {
        upsertPass(data: $inputData) {
          distributionUrl
          deliveryPageUrl
          distributionQRCode
        }
      }
    `

    const graphql = JSON.stringify({
      query: upsertPkPassMutation,
      variables: {
        inputData: {
          passTemplateId: this.config.passTemplateId,
          ...payload,
        },
      },
    })

    this.logger.debug(graphql)

    const response = await this.fetchData(graphql)

    //this.logger.debug(JSON.stringify(response))

    if (response.apiResponse) {
      const parsedApiRes = this.parseApiResponse<{ upsertPass: Pass }>(
        response.apiResponse,
      )

      if (parsedApiRes.error) {
        return {
          ok: false,
          error: parsedApiRes.error,
        }
      }

      //sweet success
      return {
        ok: true,
        data: parsedApiRes.data.upsertPass,
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

  /**
   *
   * @param payload License properties to update
   * @param nationalId The NationalID of the user
   * @returns The updates pass, if the update succeeded. If not, an error object
   */
  async updatePkPass(
    payload: PassDataInput,
    nationalId: string,
  ): Promise<Result<Pass>> {
    //First, need to find a suitable pass to update
    //TODO: PULL INTO SEPARATE FOLDER
    //TODO: DONT STRING INTERPOLATE, USE VARIABLES
    const listPassesQuery = `
      query ListPasses {
        passes(
          search: { query: "${nationalId}" },
          passTemplateId: "${this.config.passTemplateId}",
          order: { column: WHEN_MODIFIED, dir: DESC }
          ) {
            data {
              id
              status
            }
        }
      }
    `
    const listResponse = await this.fetchPkPasses(listPassesQuery)

    if (!listResponse.ok) {
      //if failure, return the response
      return listResponse
    }

    const pass = this.filterExistingPasses(listResponse.data)

    //check if existing pass was found
    if (!pass) {
      return {
        ok: false,
        error: {
          code: 3,
          message: 'No pass found for user',
        },
      }
    }

    //TODO: PULL INTO SEPARATE FOLDER
    //found a pass, use its id to retrieve the needed pass input data
    const passInputDataQuery = `
      query GetPass($id: String!) {
        pass(id: $id) {
          alreadyPaid
          expirationDate
          expirationDateWithoutTime
          expirationTime
          externalIdentifier
          id
          inputFieldValues {
            id
            value
            version
            whenCreated
            whenModified
            passInputField {
              description
              format
              id
              identifier
              label
              mandatory
              type
              version
              whenCreated
              whenModified
            }
          }
          isVoided
          passBackSide {
            expirationDate
            id
            label
            orderIndex
            value
          }
          posDistributionCode
          stampsLeft
          thumbnail {
            description
            filename
            height
            id
            title
            originalUrl
            url
            width
          }
        }
      }
    `

    const findResponse = await this.getPkPass(passInputDataQuery, pass.id)

    if (!findResponse.ok) {
      //if failure, return the response
      return findResponse
    }
    const passInputData = mapPassToPassDataInput(findResponse.data)

    const inputFieldValues = mergeInputFields(
      passInputData.inputFieldValues ?? undefined,
      payload.inputFieldValues ?? undefined,
    )
    //now we finally have the updated pass data!
    const updatedPassData = {
      ...passInputData,
      ...payload,
      inputFieldValues,
    }

    return await this.upsertPkPass(updatedPassData)
  }

  async generatePkPass(
    payload: PassDataInput,
    nationalId: string,
  ): Promise<Result<Pass>> {
    //TODO: PULL INTO SEPARATE FOLDER
    const listPassesQuery = `
      query ListPasses {
        passes(
          search: { query: "${nationalId}" },
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
    const existingPasses = await this.fetchPkPasses(listPassesQuery)

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

  async voidPkPass(nationalId: string): Promise<Result<VoidPassData>> {
    //TODO: PULL INTO SEPARATE FOLDER
    const listPassesQuery = `
      query ListPasses {
        passes(
          search: { query: "${nationalId}" },
          passTemplateId: "${this.config.passTemplateId}",
          order: { column: WHEN_MODIFIED, dir: DESC }
          ) {
          data {
            id
          }
        }
      }
    `
    const existingPasses = await this.fetchPkPasses(listPassesQuery)

    if (!existingPasses.ok) {
      return existingPasses
    }

    const activePass = existingPasses.data.find(
      (p) => p.status === PassStatus.Active,
    )

    if (!activePass) {
      return {
        ok: false,
        error: {
          code: 3,
          message: 'No active pass for user, nothing to revoke',
        },
      }
    }

    this.logger.debug('Active pass found for user, preparing to void')

    //TODO: PULL INTO SEPARATE FOLDER
    const voidPkPassMutation = `
      mutation VoidPass($id: String!) {
        voidPass(id: $id)
      }
    `

    const graphql = JSON.stringify({
      query: voidPkPassMutation,
      variables: {
        id: activePass.id,
      },
    })

    const response = await this.fetchData(graphql)

    if (response.apiResponse) {
      const parsedApiRes = this.parseApiResponse<{ success: boolean }>(
        response.apiResponse,
      )

      if (parsedApiRes.error) {
        return {
          ok: false,
          error: parsedApiRes.error,
        }
      }

      //sweet success
      return {
        ok: true,
        data: {
          voidSuccess: parsedApiRes.data.success,
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
        code: 99,
        message: 'Unknown error',
      },
    }
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

    const response = await this.fetchData(graphql)

    if (response.apiResponse) {
      const parsedApiRes = this.parseApiResponse<{ data: Array<PassTemplate> }>(
        response.apiResponse,
      )

      if (parsedApiRes.error) {
        return {
          ok: false,
          error: parsedApiRes.error,
        }
      }

      //sweet success
      return {
        ok: true,
        data: parsedApiRes.data.data,
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
