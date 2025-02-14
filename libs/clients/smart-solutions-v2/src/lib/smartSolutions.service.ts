import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { Inject } from '@nestjs/common'
import {
  DeletePass,
  DeletePassMutationVariables,
  DynamicBarcodeDataInput,
  Pass,
  PassDataInput,
  PassTemplate,
  PassTemplates,
  UpdatePass,
  UpdatePassMutationVariables,
  UpdateStatusOnPassWithDynamicBarcode,
  UpdateStatusOnPassWithDynamicBarcodeMutationVariables,
  UpsertPass,
  UpsertPassMutationVariables,
} from '../../gen/schema'
import { MODULE_OPTIONS_TOKEN } from './smartSolutions.module-definition'
import {
  DeletePassResponseData,
  ListTemplatesResponseData,
  RevokePassData,
  UpdatePassResponseData,
  UpsertPassResponseData,
  VerifyPassData,
  VerifyPassResponseData,
} from './types/responses.type'
import { GQLFetcher } from './gqlFetch'
import {
  LOG_CATEGORY,
  type SmartSolutionsModuleOptions,
} from './types/config.type'
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
  ): Promise<Result<VerifyPassData>> {
    const variables: UpdateStatusOnPassWithDynamicBarcodeMutationVariables = {
      dynamicBarcodeData: payload,
    }

    const res = await this.fetcher.fetch<VerifyPassResponseData>(
      UpdateStatusOnPassWithDynamicBarcode,
      variables,
    )

    if (!res.ok) {
      this.logger.warn('Pkpass verification failed', {
        requestId,
        category: LOG_CATEGORY,
        error: {
          message: res.error.message,
        },
      })

      return res
    }

    const verificationData = res.data.updateStatusOnPassWithDynamicBarcode

    this.logger.info('PkPass verification successful', {
      requestId,
      passId: verificationData?.id,
      category: LOG_CATEGORY,
    })

    return {
      ok: true,
      data: {
        valid: true,
        pass: res.data.updateStatusOnPassWithDynamicBarcode,
      },
    }
  }

  /**
   *
   * @param payload License properties to update
   * @returns The updated pass
   */
  async updatePkPass(
    payload: PassDataInput,
    requestId?: string,
  ): Promise<Result<Pass>> {
    if (!payload.passTemplateId) {
      this.logger.warning(
        'Pkpass update failed, missing pass template id from input',
        {
          requestId,
          category: LOG_CATEGORY,
        },
      )
      return {
        ok: false,
        error: {
          code: 10,
          message: 'Invalid input data, missing passTemplateId',
        },
      }
    }

    const variables: UpdatePassMutationVariables = {
      passTemplateId: payload.passTemplateId,
      expirationDate: payload.expirationDate,
      thumbnail: payload.thumbnail,
      values: payload.inputFieldValues,
    }

    const res = await this.fetcher.fetch<UpdatePassResponseData>(
      UpdatePass,
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

    const updatePass = res.data.updatePass

    this.logger.info('PkPass update successful', {
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
  ): Promise<Result<Pass>> {
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
      this.logger.info('PkPass created successfully', {
        requestId,
        passId: upsertPass?.id,
        category: LOG_CATEGORY,
      })
      await onCreateCallback()
    } else {
      this.logger.info('PkPass upsert successful', {
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
  ): Promise<Result<RevokePassData>> {
    const variables: DeletePassMutationVariables = {
      passTemplateId,
      values: payload.inputFieldValues ?? [],
    }

    const res = await this.fetcher.fetch<DeletePassResponseData>(
      DeletePass,
      variables,
    )

    if (!res.ok) {
      this.logger.warn('PkPass revocation failed', {
        requestId,
        passId: payload.id,
        category: LOG_CATEGORY,
        error: {
          message: res.error?.message,
        },
      })
      return res
    }

    this.logger.info('PkPass revocation successful', {
      requestId,
      passId: payload.id,
      category: LOG_CATEGORY,
    })

    return {
      ok: true,
      data: {
        success: res.data.deleteUniquePass,
      },
    }
  }

  async listTemplates(
    requestId?: string,
  ): Promise<Result<Array<PassTemplate>>> {
    const res = await this.fetcher.fetch<ListTemplatesResponseData>(
      PassTemplates,
    )

    if (!res.ok) {
      this.logger.warn('Pass template listing failed', {
        category: LOG_CATEGORY,
        error: {
          message: res.error?.message,
        },
      })
      return res
    }

    this.logger.info('Pass templates listing successful', {
      requestId,
      category: LOG_CATEGORY,
    })

    return {
      ok: true,
      data: res.data.passes?.data ?? [],
    }
  }
}
