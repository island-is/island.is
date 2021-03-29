import { Inject } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import {
  ISODate,
  Regulation,
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

  async getRegulationOriginal(
    regulationName: string,
  ): Promise<Regulation | null> {
    console.log(`regulation/nr/${regulationName}/original`)

    const response = await this.get<Regulation | null>(
      `regulation/nr/${regulationName}/original`,
      {
        cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
      },
    )
    return response
  }

  async getRegulationCurrent(
    regulationName: string,
  ): Promise<Regulation | null> {
    const response = await this.get<Regulation | null>(
      `regulation/nr/0244-2021/current`,
      {
        cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
      },
    )
    return response
  }

  async getRegulationByDate(
    regulationName: string,
    date: ISODate,
  ): Promise<Regulation | null> {
    const response = await this.get<Regulation | null>(
      `regulation/nr/${regulationName}/d/${date}`,
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
      `regulations/newest`,
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
    const response = await this.get<RegulationMinistries | null>(`years`, {
      cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
    })
    return response
  }
}
