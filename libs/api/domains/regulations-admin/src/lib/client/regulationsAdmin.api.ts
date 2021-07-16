import { Inject } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import { CreateDraftRegulationInput } from '../graphql/dto/createDraftRegulation.input'
import { EditDraftBody } from '../graphql/dto/editDraftRegulation.input'
import { Author, DB_RegulationDraft } from '@island.is/regulations/admin'
import * as kennitala from 'kennitala'

import {
  NationalRegistryXRoadConfig,
  NationalRegistryXRoadService,
} from '@island.is/api/domains/national-registry-x-road'
import { User } from '@island.is/auth-nest-tools'

export const REGULATIONS_ADMIN_OPTIONS = 'REGULATIONS_ADMIN_OPTIONS'

export interface RegulationsAdminOptions {
  baseApiUrl?: string
  regulationsApiUrl: string
  ttl?: number
  nationalRegistryXRoad: NationalRegistryXRoadConfig
}

export class RegulationsAdminApi extends RESTDataSource {
  constructor(
    @Inject(REGULATIONS_ADMIN_OPTIONS)
    private readonly options: RegulationsAdminOptions,
    private nationalRegistryXRoadService: NationalRegistryXRoadService,
  ) {
    super()
    this.baseURL = `${this.options.baseApiUrl}`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
  }

  async getDraftRegulations(
    authorization: string,
  ): Promise<DB_RegulationDraft[]> {
    const response = await this.get<DB_RegulationDraft[]>(
      '/draft_regulations',
      {},
      {
        cacheOptions: { ttl: this.options.ttl },
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
        cacheOptions: { ttl: this.options.ttl },
        headers: { authorization },
      },
    )
    return response
  }

  async getDraftRegulation(
    regulationId: string,
    authorization: string,
  ): Promise<DB_RegulationDraft | null> {
    const response = await this.get<DB_RegulationDraft | null>(
      `/draft_regulation/${regulationId}`,
      {},
      {
        // cacheOptions: { ttl: this.options.ttl },
        headers: { authorization },
      },
    )
    return response
  }

  create(
    body: CreateDraftRegulationInput,
    authorization: string,
  ): Promise<any> {
    return this.post(`/draft_regulation`, body, { headers: { authorization } })
  }

  updateById(
    id: string,
    body: EditDraftBody,
    authorization: string,
  ): Promise<any> {
    return this.put(`/draft_regulation/${id}`, body, {
      headers: { authorization },
    })
  }

  deleteById(id: string, authorization: string): Promise<number> {
    return this.delete(`/draft_regulation/${id}`, undefined, {
      headers: { authorization },
    })
  }

  async getAuthorInfo(
    nationalId: string,
    authorization: User['authorization'],
  ): Promise<Author | null> {
    if (kennitala.isCompany(nationalId)) {
      return null
    }

    const person = await this.nationalRegistryXRoadService.getNationalRegistryPerson(
      nationalId,
      authorization,
    )
    return {
      name: person.fullName,
      authorId: person.nationalId as any,
    }
  }
}
