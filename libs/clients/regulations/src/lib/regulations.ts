import { Inject } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import {
  ISODate,
  Regulation,
  RegulationLawChapterTree,
  RegulationMinistries,
  RegulationSearchResults,
  RegulationYears,
} from './regulations.types'

export const REGULATIONS_OPTIONS = 'REGULATIONS_OPTIONS'

export interface RegulationsServiceOptions {
  url: string
  ttl?: number
}

export class RegulationsService extends RESTDataSource {
  constructor(
    @Inject(REGULATIONS_OPTIONS)
    private readonly options: RegulationsServiceOptions,
  ) {
    super()
    this.baseURL = `${this.options.url}`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
  }

  async getRegulation(
    viewType: 'original' | 'current' | 'd',
    name: string,
    date?: string,
  ): Promise<Regulation | null> {
    const response = await this.get<Regulation | null>(
      `regulation/nr/${name}/${viewType}${
        viewType === 'd' && date ? '/' + date : ''
      }`,
      {
        cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
      },
    )
    return response
  }

  async getRegulations(
    type: 'newest',
    page: number,
  ): Promise<RegulationSearchResults | null> {
    const response = await this.get<RegulationSearchResults | null>(
      `regulations/${type}${page ? '?page=' + page : ''}`,
      {
        cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
      },
    )
    return response
  }

  async getRegulationsYears(year?: number): Promise<RegulationYears | null> {
    const response = await this.get<RegulationYears | null>(`years`, {
      cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
    })
    return response
  }

  async getRegulationsMinistries(
    slug?: string,
  ): Promise<RegulationMinistries | null> {
    const response = await this.get<RegulationMinistries | null>(`ministries`, {
      cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
    })
    return response
  }

  async getRegulationsLawChapters(
    tree: boolean,
  ): Promise<RegulationLawChapterTree | null> {
    const response = await this.get<RegulationLawChapterTree | null>(
      `lawchapters${tree ? '/tree' : ''}`,
      {
        cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
      },
    )
    return response
  }
}
