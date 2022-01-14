import { Inject } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import { EditDraftBody } from '../graphql/dto/editDraftRegulation.input'
import {
  DraftingStatus,
  DraftSummary,
  RegulationDraft,
  ShippedSummary,
} from '@island.is/regulations/admin'
import { uuid } from 'uuidv4'

export const REGULATIONS_ADMIN_OPTIONS = 'REGULATIONS_ADMIN_OPTIONS'

export interface RegulationsAdminOptions {
  baseApiUrl?: string
  regulationsApiUrl: string
  ttl?: number
  nationalRegistry: NationalRegistryConfig
  downloadServiceUrl?: string
}

export class RegulationsAdminApi extends RESTDataSource {
  constructor(
    @Inject(REGULATIONS_ADMIN_OPTIONS)
    private readonly options: RegulationsAdminOptions,
  ) {
    super()
    this.baseURL = `${this.options.baseApiUrl}`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    this.memoizedResults.clear()
    request.headers.set('Content-Type', 'application/json')
  }

  async getDraftRegulations(authorization: string) {
    return await this.get<
      Array<
        DraftSummary & {
          DraftingStatus: Extract<DraftingStatus, 'draft' | 'proposal'>
        }
      >
    >(
      '/draft_regulations',
      {},
      {
        headers: { authorization },
      },
    )
  }

  async getShippedRegulations(authorization: string) {
    return await this.get<
      Array<
        ShippedSummary & {
          DraftingStatus: Extract<DraftingStatus, 'shipped' | 'published'>
        }
      >
    >(
      `/draft_regulations_shipped`,
      {},
      {
        headers: { authorization },
      },
    )
  }

  async getDraftRegulation(
    draftId: string,
    authorization: string,
  ): Promise<RegulationDraft | null> {
    const response = await this.get<RegulationDraft | null>(
      `/draft_regulation/${draftId}`,
      {},
      {
        headers: { authorization },
      },
    )
    return response
  }

  create(authorization: string): Promise<any> {
    return this.post(`/draft_regulation`, {}, { headers: { authorization } })
  }

  updateById(
    draftId: string,
    body: EditDraftBody,
    authorization: string,
  ): Promise<any> {
    return this.put(`/draft_regulation/${draftId}`, body, {
      headers: { authorization },
    })
  }

  deleteById(draftId: string, authorization: string): Promise<number> {
    return this.delete(`/draft_regulation/${draftId}`, undefined, {
      headers: { authorization },
    })
  }
}
