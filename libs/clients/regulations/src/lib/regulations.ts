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

  async getRegulationOriginal(name: string): Promise<Regulation | null> {
    const response = await this.get<Regulation | null>(
      `regulation/nr/${name}/original`,
      {
        cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
      },
    )
    return response
  }

  async getRegulationCurrent(name: string): Promise<Regulation | null> {
    const response = await this.get<Regulation | null>(
      `regulation/nr/${name}/current`,
      {
        cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
      },
    )
    return response
  }

  async getRegulationByDate(
    name: string,
    date: ISODate,
  ): Promise<Regulation | null> {
    const response = await this.get<Regulation | null>(
      `regulation/nr/${name}/d/${date}`,
      {
        cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
      },
    )
    return response
  }

  async getRegulationsNewest(
    page: number,
  ): Promise<RegulationSearchResults | null> {
    const response = await this.get<RegulationSearchResults | null>(
      `regulations/newest${page ? '?page=' + page : ''}`,
      {
        cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
      },
    )
    return response
  }

  async getRegulationsYears(): Promise<RegulationYears | null> {
    const response = await this.get<RegulationYears | null>(`years`, {
      cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
    })
    return response
  }

  async getRegulationsMinistries(): Promise<RegulationMinistries | null> {
    const response = await this.get<RegulationMinistries | null>(`ministries`, {
      cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
    })
    return response
  }

  async getRegulationsLawChapters(): Promise<RegulationLawChapterTree | null> {
    const response = await this.get<RegulationLawChapterTree | null>(
      `lawchapters/tree`,
      {
        cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
      },
    )
    return response
  }
}
