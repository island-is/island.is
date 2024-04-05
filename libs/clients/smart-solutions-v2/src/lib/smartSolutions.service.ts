import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Inject } from '@nestjs/common'
import {
  DeletePass,
  DeletePassMutation,
  DeletePassMutationVariables,
  DynamicBarcodeDataInput,
  Pass,
  PassDataInput,
  PassTemplates,
  PassTemplatesQuery,
  UpdatePass,
  UpdatePassMutation,
  UpdateStatusOnPassWithDynamicBarcode,
  UpdateStatusOnPassWithDynamicBarcodeMutation,
  UpdateStatusOnPassWithDynamicBarcodeMutationVariables,
  UpsertPass,
  UpsertPassMutation,
  UpsertPassMutationVariables,
} from '../../gen/schema'
import {
  APOLLO_CLIENT_FACTORY,
  LOG_CATEGORY,
  PkPass,
  SmartSolutionsModuleOptions,
  VerifyPassResponse,
} from './smartSolutions.types'
import { MODULE_OPTIONS_TOKEN } from './smartSolutions.module-definition'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

export class SmartSolutionsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: SmartSolutionsModuleOptions,
    @Inject(APOLLO_CLIENT_FACTORY)
    private readonly client: ApolloClient<NormalizedCacheObject>,
  ) {}

  async verifyPkPass(
    payload: DynamicBarcodeDataInput,
    requestId?: string,
  ): Promise<VerifyPassResponse> {
    const res = await this.client.mutate<
      UpdateStatusOnPassWithDynamicBarcodeMutation,
      UpdateStatusOnPassWithDynamicBarcodeMutationVariables
    >({
      mutation: UpdateStatusOnPassWithDynamicBarcode,
      variables: {
        dynamicBarcodeData: payload,
      },
    })

    if (res.data?.updateStatusOnPassWithDynamicBarcode && !res.errors) {
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
  }

  /**
   *
   * @param payload License properties to update
   * @returns The updated pass
   */
  async updatePkPass(
    payload: PassDataInput,
    requestId?: string,
  ): Promise<PkPass | null> {
    const res = await this.client.mutate<
      UpdatePassMutation,
      UpsertPassMutationVariables
    >({
      mutation: UpdatePass,
      variables: {
        inputData: payload,
      },
    })

    return res.data?.updatePass ?? null
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
  ): Promise<PkPass | null> {
    const res = await this.client.mutate<
      UpsertPassMutation,
      UpsertPassMutationVariables
    >({
      mutation: UpsertPass,
      variables: {
        inputData: {
          ...payload,
          passTemplateId: this.options.config.passTemplateId,
        },
      },
    })

    if (res.errors) {
      this.logger.debug('PkPass creation failed', {
        requestId,
        passId: res.data?.upsertPass?.id,
        category: LOG_CATEGORY,
      })
      return res.data?.upsertPass ?? null
    }

    if (
      onCreateCallback &&
      res.data?.upsertPass?.whenCreated &&
      res.data?.upsertPass?.whenModified &&
      res.data?.upsertPass?.whenCreated === res.data?.upsertPass?.whenModified
    ) {
      this.logger.debug('PkPass created successfully', {
        requestId,
        passId: res.data?.upsertPass?.id,
        category: LOG_CATEGORY,
      })
      await onCreateCallback()
    } else {
      this.logger.debug('PkPass upsert successful', {
        requestId,
        passId: res.data?.upsertPass?.id,
        category: LOG_CATEGORY,
      })
    }

    return res.data?.upsertPass ?? null
  }

  async revokePkPass(
    passTemplateId: string,
    payload: PassDataInput,
    requestId?: string,
  ) {
    const res = await this.client.mutate<
      DeletePassMutation,
      DeletePassMutationVariables
    >({
      mutation: DeletePass,
      variables: {
        passTemplateId,
        values: payload,
      },
    })

    return res.data?.deleteUniquePass
  }

  async listTemplates() {
    return this.client.query<PassTemplatesQuery>({
      query: PassTemplates,
    })
  }
}
