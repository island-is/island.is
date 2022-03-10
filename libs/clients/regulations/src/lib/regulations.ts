import { Inject, Injectable, Scope } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import {
  buildRegulationApiPath,
  ISODate,
  RegQueryName,
  Year,
  Regulation,
  RegulationDiff,
  LawChapterTree,
  MinistryList,
  RegulationRedirect,
} from '@island.is/regulations'
import {
  RegulationListItem,
  RegulationOriginalDates,
  RegulationSearchResults,
  RegulationViewTypes,
  RegulationYears,
} from '@island.is/regulations/web'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'

export const REGULATIONS_OPTIONS = 'REGULATIONS_OPTIONS'

export interface RegulationsServiceOptions {
  url: string
}

@Injectable()
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
    // We need to clear the memoized cache for every request to make sure
    // updates are live when editing and viewing
    this.memoizedResults.clear()
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
    earlierDate?: ISODate | RegulationOriginalDates.gqlHack,
  ): Promise<Regulation | RegulationDiff | RegulationRedirect | null> {
    const url = buildRegulationApiPath({
      name,
      viewType,
      date,
      isCustomDiff,
      earlierDate,
    })
    const response = await this.get<
      Regulation | RegulationDiff | RegulationRedirect | null
    >(url)
    return response
  }

  async getRegulations(
    type: 'newest',
    page?: number,
  ): Promise<RegulationSearchResults | null> {
    page = page && page > 1 ? page : undefined
    const response = await this.get<RegulationSearchResults | null>(
      `regulations/${type}${page ? '?page=' + page : ''}`,
    )
    return response
  }

  async getRegulationsSearch(
    q?: string,
    rn?: string,
    year?: Year,
    yearTo?: Year,
    ch?: string,
    iA?: boolean,
    iR?: boolean,
    page?: number,
  ): Promise<RegulationListItem[] | null> {
    const response = await this.get<RegulationListItem[] | null>(
      `search`,
      // Strip away empty params
      // Object.fromEntries(Object.entries({ q, rn, year, yearTo, ch, iA, iR, page }).filter((val) => val))
      pickBy({ q, rn, year, yearTo, ch, iA, iR, page }, identity),
    )
    return response
  }

  async getRegulationsYears(): Promise<RegulationYears | null> {
    const response = await this.get<RegulationYears | null>(`years`)
    return response
  }

  async getRegulationsMinistries(): Promise<MinistryList | null> {
    const response = await this.get<MinistryList | null>(`ministries`)
    return response
  }

  async getRegulationsLawChapters(
    tree: boolean,
  ): Promise<LawChapterTree | null> {
    const response = await this.get<LawChapterTree | null>(
      `lawchapters${tree ? '/tree' : ''}`,
    )
    return response
  }
}
