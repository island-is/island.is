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
  LOG_CATEGORY,
  ListPassesResponseData,
  VoidPassResponseData,
  ListTemplatesResponseData,
  GetPassResponseData,
  UpsertPassResponseData,
  DeletePassResponseData,
  RevokePassData,
  FindUserPassData,
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
  mapErrorMessageToActionStatusCode,
  mapPassToPassDataInput,
  mergeInputFields,
} from './typeMapper'
import {
  DELETE_PASS,
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

  private async query<T>(graphql: string): Promise<Result<T>> {
    const response = await this.fetch(graphql)

    const apiRes = response.apiResponse
    if (apiRes) {
      if (apiRes.errors) {
        const resError = apiRes.errors[0]
        const code = mapErrorMessageToActionStatusCode(resError.message)
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

  /**
   *
   * @param nationalId the user's national id
   * @returns A pass if one was found, or undefined
   */
  private async findUserPass(
    nationalId: string,
  ): Promise<Result<Pass | undefined>> {
    const listPassesQuery = JSON.stringify({
      query: LIST_PASS_STATUSES,
      variables: {
        queryId: nationalId,
        passTemplateId: this.config.passTemplateId,
      },
    })
    const listRes = await this.query<ListPassesResponseData>(listPassesQuery)

    if (!listRes.ok) {
      //if failure, return the response
      return listRes
    }

    const pass = listRes.data.passes?.data[0]

    return {
      ok: true,
      data: pass,
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
    const findPassRes = await this.findUserPass(nationalId)

    if (!findPassRes.ok) {
      return findPassRes
    }

    //check if existing pass was found
    if (!findPassRes.data) {
      return {
        ok: false,
        error: {
          code: 3,
          message: 'No pass found for user',
        },
      }
    }

    const pass = findPassRes.data

    //get the pass data
    const getPassQuery = JSON.stringify({
      query: GET_PASS,
      variables: {
        id: pass.id,
      },
    })

    const getPassRes = await this.query<GetPassResponseData>(getPassQuery)

    if (!getPassRes.ok) {
      //if failure, return the response
      return getPassRes
    }

    const passInputData = mapPassToPassDataInput(getPassRes.data.pass)

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

  /**
   *
   * @param payload The new pass data
   * @param nationalId the user's national id
   * @returns the newly created pass, or an old one if a pass was previously created,
   */
  async generatePkPass(
    payload: PassDataInput,
    nationalId: string,
  ): Promise<Result<Pass>> {
    const findPassRes = await this.findUserPass(nationalId)

    if (!findPassRes.ok) {
      return findPassRes
    }

    const pass = findPassRes.data

    if (pass) {
      if (pass.status === PassStatus.Voided) {
        //pass is voided, which is an invalid state
        return {
          ok: false,
          error: {
            code: 5,
            message: 'Pass is void',
          },
        }
      }
      //pass is good
      return {
        ok: true,
        data: pass,
      }
    }
    this.logger.debug('No active pkpass found for user, creating a new one')

    //Create the pass
    return await this.upsertPkPass(payload)
  }

  async revokePkPass(nationalId: string): Promise<Result<RevokePassData>> {
    const listPassIds = JSON.stringify({
      query: LIST_PASS_STATUSES,
      variables: {
        queryId: nationalId,
        passTemplateId: this.config.passTemplateId,
      },
    })
    const passResponse = await this.query<ListPassesResponseData>(listPassIds)

    if (!passResponse.ok) {
      return passResponse
    }

    //find the pass to update
    const activePass = passResponse.data.passes?.data.find(
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

    //find the proper pass and void it
    const voidResponse = await this.voidPkPass(activePass.id)

    if (!voidResponse.ok) {
      return voidResponse
    }

    //pass is now voided, time to delete it
    const deleteResponse = await this.deletePkPass(activePass.id)

    if (!deleteResponse.ok) {
      return deleteResponse
    }

    //deletion success
    return {
      ok: true,
      data: { success: deleteResponse.data.deletePass },
    }
  }

  private async deletePkPass(
    passId: string,
  ): Promise<Result<DeletePassResponseData>> {
    const deletePassMutation = JSON.stringify({
      query: DELETE_PASS,
      variables: {
        id: passId,
      },
    })

    const response = await this.query<DeletePassResponseData>(
      deletePassMutation,
    )

    if (response.ok) {
      if (response.data.deletePass) {
        return {
          ok: true,
          data: { deletePass: response.data.deletePass },
        }
      }
      //if the deletion failed for some reason
      return {
        ok: false,
        error: {
          code: 13,
          message: 'Service error, delete pass failed',
        },
      }
    }

    return response
  }

  private async voidPkPass(
    passId: string,
  ): Promise<Result<VoidPassResponseData>> {
    const voidPassMutation = JSON.stringify({
      query: VOID_PASS,
      variables: {
        id: passId,
      },
    })

    const response = await this.query<VoidPassResponseData>(voidPassMutation)

    if (response.ok) {
      if (response.data.voidPass) {
        return {
          ok: true,
          data: { voidPass: response.data.voidPass },
        }
      }
      //if the voiding failed for some reason
      return {
        ok: false,
        error: {
          code: 13,
          message: 'Service error, void pass failed',
        },
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
