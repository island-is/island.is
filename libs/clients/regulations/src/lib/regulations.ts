import { Inject } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import {
  ISODate,
  RegQueryName,
  Regulation,
  RegulationLawChapterTree,
  RegulationListItem,
  RegulationMinistryList,
  RegulationRedirect,
  RegulationSearchResults,
  RegulationViewTypes,
  RegulationYears,
  Year,
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
  /*
  Example api routes for regulation
  regulation/[name]/current
  regulation/[name]/original
  regulation/[name]/diff
  regulation/[name]/d/[date]
  regulation/[name]/d/[date]/diff
  regulation/[name]/d/[date]/diff/[earlierDate]
*/
  async getRegulation(
    viewType: RegulationViewTypes,
    name: RegQueryName,
    date?: ISODate,
    isCustomDiff?: boolean,
    earlierDate?: ISODate | 'original',
  ): Promise<Regulation | RegulationRedirect | null> {
    let params: string = viewType

    if (viewType === 'd') {
      if (date) {
        params = 'd/' + date
        if (isCustomDiff) {
          params += '/diff' + (earlierDate ? '/' + earlierDate : '')
        }
      } else {
        // Treat `viewType` 'd' with no `date` as 'current'
        // ...either that or throwing an error...
        // ...or tightening the type signature to prevent that happening.
        params = 'current'
      }
    }
    const response = await this.get<Regulation | RegulationRedirect | null>(
      `/regulation/${name}/${params}`,
      {
        cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
      },
    )
    return response
  }

  async getRegulations(
    type: 'newest',
    page?: number,
  ): Promise<RegulationSearchResults | null> {
    page = page && page > 1 ? page : undefined
    const response = await this.get<RegulationSearchResults | null>(
      `regulations/${type}${page ? '?page=' + page : ''}`,
      {
        cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
      },
    )
    return response
  }

  async getRegulationsSearch(
    q?: string,
    rn?: string,
    year?: Year,
    yearTo?: Year,
    ch?: string,
  ): Promise<RegulationListItem[] | null> {
    const response = await this.get<RegulationListItem[] | null>(
      `search`,
      { q, rn, year, yearTo, ch },
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

  async getRegulationsMinistries(): Promise<RegulationMinistryList | null> {
    const response = await this.get<RegulationMinistryList | null>(
      `ministries`,
      {
        cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
      },
    )
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
