import { Inject } from '@nestjs/common'
import {
  RegulationDraft,
  ShippedSummary,
  TaskListType,
} from '@island.is/regulations/admin'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { Auth } from '@island.is/auth-nest-tools'
import { RegulationsAdminClientConfig } from './RegulationsAdminClientConfig'
import { ConfigType } from '@nestjs/config'

export class RegulationsAdminClientService {
  baseURL: string
  fetch: EnhancedFetchAPI

  constructor(
    @Inject(RegulationsAdminClientConfig.KEY)
    private readonly config: ConfigType<typeof RegulationsAdminClientConfig>,
  ) {
    this.baseURL = `${this.config.baseApiUrl}`
    this.fetch = createEnhancedFetch({
      name: 'Regulations-AdminClientService',
    })
  }

  async get<T>(path: string, auth: Auth, params?: Record<string, string>) {
    const url = new URL(`${this.baseURL}${path}`)
    if (params) {
      url.search = new URLSearchParams(params).toString()
    }
    const response = await this.fetch(url.toString(), {
      auth,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return (await response.json()) as T
  }

  async getDraftRegulations(auth: Auth, page?: number) {
    return await this.get<TaskListType>(
      '/draft_regulations',
      auth,
      page
        ? {
            page: page.toString(),
          }
        : undefined,
    )
  }

  async getShippedRegulations(auth: Auth) {
    return await this.get<ShippedSummary[]>(`/draft_regulations_shipped`, auth)
  }

  async getDraftRegulation(
    draftId: string,
    auth: Auth,
  ): Promise<RegulationDraft | null> {
    const response = await this.get<RegulationDraft | null>(
      `/draft_regulation/${draftId}`,
      auth,
    )
    return response
  }
}
