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
  VoidPassResponseData,
  ListTemplatesResponseData,
  UpsertPassResponseData,
  DeletePassResponseData,
  RevokePassData,
  UnvoidPassResponseData,
  UpdatePassResponseData,
} from './smartSolutions.types'
import {
  DynamicBarcodeDataInput,
  Pass,
  PassDataInput,
  PassInputField,
  PassTemplate,
} from '../../gen/schema'
import { Inject } from '@nestjs/common'
import { SMART_SOLUTIONS_API_CONFIG } from './smartSolutions.config'
import { mapErrorMessageToActionStatusCode } from './typeMapper'
import {
  DELETE_PASS,
  LIST_TEMPLATES,
  UNVOID_PASS,
  UPDATE_PASS,
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
   * @param payload The scanner data
   * @returns An object containing a boolean that signifies if a pass is valid or not
   */

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

  /**
   *
   * @param payload License properties to update
   * @param nationalId The NationalID of the user
   * @returns The updated pass, if the update succeeded. If not, an error object
   */
  async updatePkPass(
    payload: PassDataInput,
    nationalId: string,
  ): Promise<Result<Pass>> {
    const graphql = JSON.stringify({
      query: UPDATE_PASS,
      variables: {
        expirationDate: payload.expirationDate,
        passTemplateId: payload.passTemplateId,
        thumbnail: payload.thumbnail,
        values: payload.inputFieldValues,
      },
    })

    const res = await this.query<UpdatePassResponseData>(graphql)

    if (res.ok) {
      this.logger.info('Pass update successful', {
        passId: res.data.updatePass.id,
        category: LOG_CATEGORY,
      })
      return {
        ok: true,
        data: res.data.updatePass,
      }
    }

    return {
      ...res,
    }
  }

  /**
   *
   * @param payload The new pass data
   * @param nationalId the user's national id
   * @returns the newly created pass, or an updated old one if a pass was previously created,
   */
  async generatePkPass(
    payload: PassDataInput,
    nationalId: string,
    onCreateCallback?: () => Promise<void>,
  ): Promise<Result<Pass>> {
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
      //if the values match, the pass is new
      if (
        res.data.upsertPass.whenCreated &&
        res.data.upsertPass.whenModified &&
        res.data.upsertPass.whenCreated === res.data.upsertPass.whenModified &&
        onCreateCallback
      ) {
        this.logger.info('Pass created successfully', {
          passId: res.data.upsertPass.id,
          category: LOG_CATEGORY,
        })
        onCreateCallback()
      } else {
        this.logger.info('Pass upsert successful', {
          passId: res.data.upsertPass.id,
          category: LOG_CATEGORY,
        })
      }
      return {
        ok: true,
        data: res.data.upsertPass,
      }
    }

    return res
  }

  async revokePkPass(
    passTemplateId: string,
    payload: PassDataInput,
  ): Promise<Result<RevokePassData>> {
    //first, void it
    const graphql = JSON.stringify({
      query: VOID_PASS,
      variables: {
        passTemplateId,
        values: payload.inputFieldValues,
      },
    })

    const res = await this.query<VoidPassResponseData>(graphql)

    if (!res.ok) {
      this.logger.info('Pass void failed', {
        category: LOG_CATEGORY,
        passTemplateId,
      })

      return res
    }

    this.logger.info('Pass voided successfully', {
      category: LOG_CATEGORY,
      passTemplateId,
    })
    //pass is void, time to delete
    const deleteGraphql = JSON.stringify({
      query: DELETE_PASS,
      variables: {
        passTemplateId,
        values: payload.inputFieldValues,
      },
    })

    const deleteRes = await this.query<DeletePassResponseData>(deleteGraphql)

    if (!deleteRes.ok) {
      this.logger.info('Pass delete failed', {
        category: LOG_CATEGORY,
        passTemplateId,
      })
      return deleteRes
    }

    this.logger.info('Pass deleted successfully', {
      category: LOG_CATEGORY,
      passTemplateId,
    })
    //deletion success
    return {
      ok: true,
      data: { success: deleteRes.data.deleteUniquePass },
    }
  }

  private async unvoidPkPass(
    passId: string,
  ): Promise<Result<UnvoidPassResponseData>> {
    const unvoidPassMutation = JSON.stringify({
      query: UNVOID_PASS,
      variables: {
        id: passId,
      },
    })

    const response = await this.query<UnvoidPassResponseData>(
      unvoidPassMutation,
    )

    if (response.ok) {
      if (response.data.unvoidPass) {
        return {
          ok: true,
          data: { unvoidPass: response.data.unvoidPass },
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
