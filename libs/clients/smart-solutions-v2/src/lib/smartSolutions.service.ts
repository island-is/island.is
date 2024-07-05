import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Inject } from '@nestjs/common'
import {
  DeletePass,
  DeletePassMutationVariables,
  DynamicBarcodeDataInput,
  PassDataInput,
  PassTemplatePageInfo,
  PassTemplates,
  UpdatePass,
  UpdatePassMutationVariables,
  UpdateStatusOnPassWithDynamicBarcode,
  UpdateStatusOnPassWithDynamicBarcodeMutationVariables,
  UpsertPass,
  UpsertPassMutationVariables,
} from '../../gen/schema'
import { GraphQLClient } from 'graphql-request'
import { MODULE_OPTIONS_TOKEN } from './smartSolutions.module-definition'
import {
  PkPass,
  UpdatePassResponseData,
  UpsertPassResponseData,
  VerifyPassData,
} from './types/responses.type'
import { GraphqlErrorResponse } from './types/graphqlFetchResponses.type'
import { GQLFetcher } from './gqlFetch'
import { LOG_CATEGORY, SmartSolutionsModuleOptions } from './types/config.type'
import { Result } from './types/result.type'

export class SmartSolutionsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: SmartSolutionsModuleOptions,
    private readonly fetcher: GQLFetcher,
  ) {}

  async verifyPkPass(
    payload: DynamicBarcodeDataInput,
    requestId?: string,
  ): Promise<VerifyPassData | null> {
    return null
    /*
    const vnulliables: UpdateStatusOnPassWithDynamicBarcodeMutationVariables = {
      dynamicBarcodeData: payload,
    }

    let res
    try {
      res = await this.client.request(
        UpdateStatusOnPassWithDynamicBarcode,
        variables,
      )
    } catch (e) {
      this.logger.warn('Verification post failed', {
        requestId,
        passId: res.data.updateStatusOnPassWithDynamicBarcode?.id,
        category: LOG_CATEGORY,
      })
      return null
    }

    this.logger.debug('VERIFY', res)

    return {
      valid: true,
      data: res.data.updateStatusOnPassWithDynamicBarcode,
    }


    if (
      !isErrorResponse(res) &&
      res.data.updateStatusOnPassWithDynamicBarcode
    ) {
      this.logger.debug('PkPass verification successful', {
        requestId,
        passId: res.data.updateStatusOnPassWithDynamicBarcode?.id,
        category: LOG_CATEGORY,
      })
      return {
        valid: true,
        data: res.data.updateStatusOnPassWithDynamicBarcode,
      }
    }

    this.logger.warning('PkPass verification failed', {
      error: { ...res.errors },
      requestId,
      category: LOG_CATEGORY,
    })

    return {
      valid: false,
      data: res.data?.updateStatusOnPassWithDynamicBarcode,
    }
      */
  }

  /**
   *
   * @param payload License properties to update
   * @returns The updated pass
   */
  async updatePkPass(
    payload: PassDataInput,
    requestId?: string,
  ): Promise<Result<PkPass>> {
    if (!payload.passTemplateId) {
      this.logger.warning(
        'Pkpass update failed, missing pass template id from input',
        {
          requestId,
          category: LOG_CATEGORY,
        },
      )
      return null
    }

    const variables: UpdatePassMutationVariables = {
      passTemplateId: payload.passTemplateId,
      expirationDate: payload.expirationDate,
      thumbnail: payload.thumbnail,
      values: payload.inputFieldValues,
    }

    const res = await this.fetcher.fetch<UpdatePassResponseData>(UpdatePass, {
      variables,
    })

    if (!res.ok) {
      this.logger.warn('PkPass creation failed', {
        requestId,
        passId: payload.id,
        category: LOG_CATEGORY,
        error: {
          message: res.error.message,
        },
      })
      return res
    }

    const updatePass = res.data.updatePass
    this.logger.debug('PkPass upates successfully', {
      requestId,
      passId: updatePass.id,
      category: LOG_CATEGORY,
    })
    return {
      ok: true,
      data: updatePass,
    }
  }

  /**
   *
   * @param payload The new pass data
   * @returns the newly created pass, or an updated old one if a pass was previously created,
   */
  async generatePkPass(
    payload: PassDataInput,
    onCreateCallback?: () => Promise<void>,
    requestId?: string,
  ): Promise<Result<PkPass>> {
    const variables: UpsertPassMutationVariables = {
      inputData: {
        ...payload,
        passTemplateId: this.options.config.passTemplateId,
      },
    }

    const res = await this.fetcher.fetch<UpsertPassResponseData>(
      UpsertPass,
      variables,
    )

    if (!res.ok) {
      this.logger.warn('PkPass creation failed', {
        requestId,
        passId: payload.id,
        category: LOG_CATEGORY,
        error: {
          message: res.error.message,
        },
      })
      return res
    }

    const upsertPass = res.data.upsertPass
    if (
      onCreateCallback &&
      upsertPass?.whenCreated &&
      upsertPass?.whenModified &&
      upsertPass?.whenCreated === upsertPass?.whenModified
    ) {
      this.logger.debug('PkPass created successfully', {
        requestId,
        passId: upsertPass?.id,
        category: LOG_CATEGORY,
      })
      await onCreateCallback()
    } else {
      this.logger.debug('PkPass upsert successful', {
        requestId,
        passId: upsertPass?.id,
        category: LOG_CATEGORY,
      })
    }

    return {
      ok: true,
      data: upsertPass,
    }
  }

  async revokePkPass(
    passTemplateId: string,
    payload: PassDataInput,
    requestId?: string,
  ) {
    return null
    /*
  const variables: DeletePassMutationVariables = {
  passTemplateId,
  values: payload,
  }

  let res: {
  deleteUniquePass: boolean
  }
  try {
  res = await this.client.request(DeletePass, variables)
  } catch (e) {
  const errors: GraphqlErrorResponse = e

  const error = errors.response.errors?.[0]
  this.logger.warn('PkPass revocation failed', {
    requestId,
    passId: payload.id,
    category: LOG_CATEGORY,
    error: {
      message: error?.message,
    },
  })
  return null
  }

  return res.deleteUniquePass
  */
  }

  async listTemplates() {
    return null
    /*
  let res: {
  passTemplates: PassTemplatePageInfo
  }
  try {
  res = await this.client.request(PassTemplates)
  } catch (e) {
  const errors: GraphqlErrorResponse = e

  const error = errors.response.errors?.[0]
  this.logger.warn('Pass template listing failed', {
    category: LOG_CATEGORY,
    error: {
      message: error?.message,
    },
  })
  return null
  }

  return res.passTemplates.data
  */
  }
}
