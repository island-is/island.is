import { Inject } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import { CreateDraftRegulationInput } from '../graphql/dto/createDraftRegulation.input'
import { EditDraftBody } from '../graphql/dto/editDraftRegulation.input'
import { Author, DB_RegulationDraft } from '@island.is/regulations/admin'
import * as kennitala from 'kennitala'
import { uuid } from 'uuidv4'

import {
  NationalRegistryApi,
  NationalRegistryConfig,
} from '@island.is/clients/national-registry-v1'
import { User } from '@island.is/auth-nest-tools'
import { Kennitala } from '@island.is/regulations'

export const REGULATIONS_ADMIN_OPTIONS = 'REGULATIONS_ADMIN_OPTIONS'

export interface RegulationsAdminOptions {
  baseApiUrl?: string
  regulationsApiUrl: string
  ttl?: number
  nationalRegistry: NationalRegistryConfig
}

export class RegulationsAdminApi extends RESTDataSource {
  constructor(
    @Inject(REGULATIONS_ADMIN_OPTIONS)
    private readonly options: RegulationsAdminOptions,
    private readonly nationalRegistryApi: NationalRegistryApi,
  ) {
    super()
    this.baseURL = `${this.options.baseApiUrl}`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    this.memoizedResults.clear()
    request.headers.set('Content-Type', 'application/json')
  }

  async getDraftRegulations(
    authorization: string,
  ): Promise<DB_RegulationDraft[]> {
    const response = await this.get<DB_RegulationDraft[]>(
      '/draft_regulations',
      {},
      {
        headers: { authorization },
      },
    )
    return response
  }

  async getShippedRegulations(
    authorization: string,
  ): Promise<DB_RegulationDraft[]> {
    const response = await this.get<DB_RegulationDraft[]>(
      `/draft_regulations_shipped`,
      {},
      {
        headers: { authorization },
      },
    )
    return response
  }

  async getDraftRegulation(
    draftId: string,
    authorization: string,
  ): Promise<DB_RegulationDraft | null> {
    const response = await this.get<DB_RegulationDraft | null>(
      `/draft_regulation/${draftId}`,
      {},
      {
        headers: { authorization },
      },
    )
    return response
  }

  create(authorization: string): Promise<any> {
    return this.post(
      `/draft_regulation`,
      {
        id: uuid(),
        drafting_status: 'draft',
        title: '',
        text: '',
        drafting_notes: '',
        ministry_id: '',
        // FIXME: the below fields should be make optional, and empty/null/undefined by default
        ideal_publish_date: '2022-06-01',
        type: 'base',
      },
      { headers: { authorization } },
    )
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

  async getAuthorInfo(kt: string, user: User): Promise<Author | null> {
    if (kennitala.isCompany(kt)) {
      return null
    }

    const person = await this.nationalRegistryApi.getUser(kt)

    if (!person) {
      return null
    }

    return {
      name: person.Fulltnafn,
      authorId: kt as Kennitala,
    }
  }
}
