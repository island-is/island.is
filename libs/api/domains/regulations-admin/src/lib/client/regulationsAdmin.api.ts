import { Inject } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import { EditDraftBody } from '../graphql/dto/editDraftRegulation.input'
import { RegulationsAdminClientConfig } from '@island.is/clients/regulations-admin'
import { ConfigType } from '@nestjs/config'
import { DraftRegulationCancelModel } from '../graphql/models/draftRegulationCancel.model'
import { DraftRegulationChangeModel } from '../graphql/models/draftRegulationChange.model'
import {
  CreateDraftRegulationCancelInput,
  UpdateDraftRegulationCancelInput,
  DeleteDraftRegulationCancelInput,
  DeleteDraftRegulationChangeInput,
  UpdateDraftRegulationChangeInput,
  CreateDraftRegulationChangeInput,
} from '../graphql/dto'
import { DraftImpact } from '@island.is/regulations/admin'
import { CreateDraftRegulationInput } from '../graphql/dto/createDraftRegulation.input'

export class RegulationsAdminApi extends RESTDataSource {
  constructor(
    @Inject(RegulationsAdminClientConfig.KEY)
    private readonly config: ConfigType<typeof RegulationsAdminClientConfig>,
  ) {
    super()
    this.baseURL = `${this.config.baseApiUrl}`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    this.memoizedResults.clear()
    request.headers.set('Content-Type', 'application/json')
  }

  create(
    authorization: string,
    input: CreateDraftRegulationInput,
  ): Promise<any> {
    return this.post(`/draft_regulation`, input, { headers: { authorization } })
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

  async getImpactsByName(regulation: string, authorization: string) {
    const response = await this.get<DraftImpact[] | null>(
      `/draft_regulation_impacts/${regulation}`,
      {},
      {
        headers: { authorization },
      },
    )
    return response
  }

  createDraftRegulationCancel(
    input: CreateDraftRegulationCancelInput,
    authorization: string,
  ): Promise<DraftRegulationCancelModel> {
    return this.post(`/draft_regulation_cancel/`, input, {
      headers: { authorization },
    })
  }

  updateDraftRegulationCancel(
    update: UpdateDraftRegulationCancelInput,
    authorization: string,
  ): Promise<DraftRegulationCancelModel> {
    const { id, ...input } = update
    return this.put(`/draft_regulation_cancel/${id}`, input, {
      headers: { authorization },
    })
  }

  deleteDraftRegulationCancel(
    input: DeleteDraftRegulationCancelInput,
    authorization: string,
  ): Promise<any> {
    return this.delete(`/draft_regulation_cancel/${input.id}`, undefined, {
      headers: { authorization },
    })
  }

  createDraftRegulationChange(
    input: CreateDraftRegulationChangeInput,
    authorization: string,
  ): Promise<DraftRegulationChangeModel> {
    return this.post(`/draft_regulation_change/`, input, {
      headers: { authorization },
    })
  }

  updateDraftRegulationChange(
    update: UpdateDraftRegulationChangeInput,
    authorization: string,
  ): Promise<DraftRegulationChangeModel> {
    const { id, ...input } = update
    return this.put(`/draft_regulation_change/${id}`, input, {
      headers: { authorization },
    })
  }

  deleteDraftRegulationChange(
    input: DeleteDraftRegulationChangeInput,
    authorization: string,
  ): Promise<any> {
    return this.delete(`/draft_regulation_change/${input.id}`, undefined, {
      headers: { authorization },
    })
  }
}
