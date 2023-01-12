import fetch, { Response } from 'node-fetch'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  Result,
  ApiResponse,
  FetchResponse,
  ServiceError,
  VerifyPassResponseData,
  VerifyPassData,
  VoidPassData,
  LOG_CATEGORY,
  ListPassesResponseData,
  VoidPassResponseData,
  ListTemplatesResponseData,
  GetPassResponseData,
  UpsertPassResponseData,
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
import {
  GET_PASS,
  LIST_PASSES,
  LIST_PASS_STATUSES,
  LIST_TEMPLATES,
  UPSERT_PASS,
  VERIFY_PKPASS,
  VOID_PASS,
} from './graphql/queries'

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

  private async fetch(query: string): Promise<FetchResponse> {
    let res: Response | null = null
    try {
      res = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'X-API-KEY': this.config.apiKey,
          'Content-Type': 'application/json',
        },
        body: query,
      })
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

  private filterExistingPasses(passes: Array<Pass>): Pass | undefined {
    if (!(passes.length > 0)) {
      return
    }
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

  private async query<T>(graphql: string): Promise<Result<T>> {
    const response = await this.fetch(graphql)

    const apiRes = response.apiResponse
    if (apiRes) {
      if (apiRes.errors) {
        const resError = apiRes.errors[0]
        const code = MapErrorMessageToActionStatusCode(resError.message)
        const error = {
          code,
          message: resError.message,
          data: JSON.stringify(resError),
        } as ServiceError

        return { ok: false, error }
      }
      const data = apiRes.data as T

      //shouldn't happen
      if (!data) {
        const error = {
          code: 13,
          data: JSON.stringify(apiRes),
          message: 'Service error',
        }
        return { ok: false, error }
      }

      return { ok: true, data }
    }

    if (response.error) {
      return { ok: false, error: response.error }
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
    const graphql = JSON.stringify({
      query: VERIFY_PKPASS,
      variables: {
        dynamicBarcodeData: payload,
      },
    })

    const res = await this.query<VerifyPassResponseData>(graphql)

    if (res.ok) {
      return {
        ok: true,
        data: {
          valid: true,
          pass: res.data.updateStatusOnPassWithDynamicBarcode,
        },
      }
    }

    return res
  }

  async upsertPkPass(payload: PassDataInput): Promise<Result<Pass>> {
    const graphql = JSON.stringify({
      query: UPSERT_PASS,
      variables: {
        inputData: {
          passTemplateId: this.config.passTemplateId,
          ...payload,
        },
      },
    })

    const res = await this.query<UpsertPassResponseData>(graphql)

    if (res.ok) {
      return {
        ok: true,
        data: res.data.upsertPass,
      }
    }

    return res
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
    const listPassesQuery = JSON.stringify({
      query: LIST_PASS_STATUSES,
      variables: {
        queryId: nationalId,
        passTemplateId: this.config.passTemplateId,
      },
    })
    //First, need to find a suitable pass to update
    const listResponse = await this.query<ListPassesResponseData>(
      listPassesQuery,
    )

    if (!listResponse.ok) {
      //if failure, return the response
      return listResponse
    }

    const pass = this.filterExistingPasses(listResponse.data.passes?.data ?? [])

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

    //found a pass, use its id to retrieve the needed pass input data
    const getPassQuery = JSON.stringify({
      query: GET_PASS,
      variables: {
        id: pass.id,
      },
    })

    const passRes = await this.query<GetPassResponseData>(getPassQuery)

    if (!passRes.ok) {
      //if failure, return the response
      return passRes
    }

    const passInputData = mapPassToPassDataInput(passRes.data.pass)

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

    //Now we can just call upsert with the correct data
    return await this.upsertPkPass(updatedPassData)
  }

  async generatePkPass(
    payload: PassDataInput,
    nationalId: string,
  ): Promise<Result<Pass>> {
    const listPassesQuery = JSON.stringify({
      query: LIST_PASSES,
      variables: {
        queryId: nationalId,
        passTemplateId: this.config.passTemplateId,
      },
    })

    const existingPasses = await this.query<ListPassesResponseData>(
      listPassesQuery,
    )

    if (existingPasses.ok) {
      const existingPass = this.filterExistingPasses(
        existingPasses.data.passes?.data ?? [],
      )
      if (existingPass) {
        return {
          ok: true,
          data: existingPass,
        }
      }
    }
    this.logger.debug('No active pkpass found for user, creating a new one')

    //Create the pass
    return await this.upsertPkPass(payload)
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
    const listPassIds = JSON.stringify({
      query: LIST_PASS_STATUSES,
      variables: {
        queryId: nationalId,
        passTemplateId: this.config.passTemplateId,
      },
    })
    const existingPasses = await this.query<ListPassesResponseData>(listPassIds)

    if (!existingPasses.ok) {
      return existingPasses
    }

    const activePass = existingPasses.data.passes?.data.find(
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

    const voidPassMutation = JSON.stringify({
      query: VOID_PASS,
      variables: {
        id: activePass.id,
      },
    })

    const response = await this.query<VoidPassResponseData>(voidPassMutation)

    if (response.ok) {
      return {
        ok: true,
        data: { success: response.data.voidPass },
      }
    }

    return response
  }

  async listTemplates(): Promise<Result<Array<PassTemplate> | undefined>> {
    const graphql = JSON.stringify({
      query: LIST_TEMPLATES,
      variables: {},
    })

    const response = await this.query<ListTemplatesResponseData>(graphql)

    if (response.ok) {
      return {
        ok: true,
        data: response.data.passes?.data,
      }
    }

    return response
  }
}
