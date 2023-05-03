import { Inject, Injectable } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import { ConfigType } from '@nestjs/config'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  buildRegulationApiPath,
  ISODate,
  LawChapterSlug,
  MinistrySlug,
  RegName,
  RegQueryName,
  Year,
  Regulation,
  RegulationDiff,
  LawChapter,
  LawChapterTree,
  MinistryList,
  RegulationRedirect,
  RegulationOptionList,
} from '@island.is/regulations'
import {
  RegulationListItem,
  RegulationOriginalDates,
  RegulationSearchResults,
  RegulationViewTypes,
  RegulationYears,
} from '@island.is/regulations/web'
import {
  PresignedPost,
  PresignedPostResults,
  RegulationPdf,
  RegulationPdfInput,
  RegulationPdfResponse,
} from '@island.is/regulations/admin'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'
import { RegulationsClientConfig } from './regulations.config'
const LOG_CATEGORY = 'clients-regulation'

@Injectable()
export class RegulationsService extends RESTDataSource {
  constructor(
    @Inject(RegulationsClientConfig.KEY)
    private readonly options: ConfigType<typeof RegulationsClientConfig>,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
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

  async createPresignedPost(
    fileName: string,
    regId: string,
    hash?: string,
  ): Promise<PresignedPostResults | null> {
    const body = { fileName, hash }

    let response: PresignedPost | null
    try {
      response = await this.post<PresignedPost | null>(
        `file-presigned?scope=${regId}`,
        JSON.stringify(body),
        {
          headers: {
            'X-ApiKey': this.options.presignedKey ?? '',
          },
        },
      )
    } catch (e) {
      const errorMessage = 'Presigned Post creation failed'
      this.logger.error(errorMessage, {
        ...e,
        category: LOG_CATEGORY,
      })

      return {
        error: errorMessage,
      }
    }

    if (!response) {
      return {
        error: 'Presigned post contains no data',
      }
    }
    return { data: response }
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

  async getRegulationOnDate(
    viewType: RegulationViewTypes,
    name: RegQueryName,
    date?: ISODate,
  ): Promise<Regulation | RegulationDiff | RegulationRedirect | null> {
    const response = await this.get<
      Regulation | RegulationDiff | RegulationRedirect | null
    >(
      `/regulation/${name}/${
        viewType === 'current' ? 'current' : 'on/' + date
      }`,
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
    )
    return response
  }

  async getRegulationOptionList(
    names: Array<RegName>,
  ): Promise<RegulationOptionList> {
    const response =
      (await this.get<RegulationOptionList>(
        'regulations/optionsList?names=' + names.join(','),
      )) ?? []
    return response
  }

  async getRegulationsOptionSearch(
    q?: string,
    rn?: string,
    year?: Year,
    yearTo?: Year,
    ch?: string,
    iA?: boolean,
    iR?: boolean,
    page?: number,
  ): Promise<RegulationOptionList | null> {
    const searchRes = await this.getRegulationsSearch(
      q,
      rn,
      year,
      yearTo,
      ch,
      iA,
      iR,
      page,
    )

    const searchNames = searchRes?.data?.map((item) => item.name)
    if (searchNames && searchNames?.length > 0) {
      return await this.getRegulationOptionList(searchNames)
    }

    return null
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
  ): Promise<RegulationSearchResults | null> {
    const response = await this.get<RegulationSearchResults | null>(
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

  async getRegulationsMinistries(
    slugs?: Array<MinistrySlug>,
  ): Promise<MinistryList | null> {
    const response = await this.get<MinistryList | null>(
      `ministries${slugs ? '?slugs=' + slugs.join(',') : ''}`,
    )
    return response
  }

  async getRegulationsLawChapters(
    tree: boolean,
    slugs?: Array<LawChapterSlug>,
  ): Promise<LawChapterTree | LawChapter[] | null> {
    const response = await this.get<LawChapterTree | LawChapter[] | null>(
      `lawchapters${tree ? '/tree' : ''}${
        slugs ? '?slugs=' + slugs.join(',') : ''
      }`,
    )
    return response
  }

  async generateDraftRegulationPdf(
    regulationBody: RegulationPdfInput,
  ): Promise<RegulationPdf> {
    const defaultFilename = `draft-regulation-${regulationBody.name}.pdf`
    const defaultMimeType = 'application/pdf'

    let response: RegulationPdfResponse | null

    try {
      response = await this.post<RegulationPdfResponse>(
        '/regulation/generate-pdf?responseType=base64',
        JSON.stringify(regulationBody),
      )
    } catch (e) {
      const errorMessage = 'unable to download pdf'
      this.logger.error(errorMessage, {
        ...e,
        category: LOG_CATEGORY,
      })
      return {
        error: errorMessage,
      }
    }

    if (!response || !response.data) {
      const warningMessage = 'response does not include data'
      this.logger.warn(warningMessage, {
        category: LOG_CATEGORY,
      })
      return {
        error: warningMessage,
      }
    }

    return {
      data: {
        base64: response.data,
        fileName: response.fileName ?? defaultFilename,
        mimeType: response.mimeType ?? defaultMimeType,
      },
    }
  }
}
