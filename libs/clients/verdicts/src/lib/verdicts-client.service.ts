import { Injectable } from '@nestjs/common'
import sanitizeHtml from 'sanitize-html'
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown'
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { isValidDate, sortAlpha } from '@island.is/shared/utils'

import { BookingApi, VerdictApi, LawyerApi } from '../../gen/fetch/gopro'
import {
  type ApiV2VerdictGetAgendasPostRequest,
  DefaultApi,
} from '../../gen/fetch/supreme-court'
import { logger } from '@island.is/logging'

const ITEMS_PER_PAGE = 10
const GOPRO_ID_PREFIX = 'g-'
const SUPREME_COURT_ID_PREFIX = 's-'

const convertHtmlToContentfulRichText = async (html: string, id: string) => {
  const sanitizedHtml = sanitizeHtml(html)
  const markdown = NodeHtmlMarkdown.translate(sanitizedHtml)
  const richText = await richTextFromMarkdown(markdown)
  return {
    __typename: 'Html',
    document: richText,
    id,
  }
}

const safelyConvertStringToDate = (
  dateString: string | undefined,
  variableName: string,
) => {
  if (!dateString) return undefined
  try {
    const date = new Date(dateString)
    if (isValidDate(date)) return date
  } catch (error) {
    logger.info(
      `Invalid ${variableName} passed to "getVerdicts" endpoint`,
      error,
    )
  }
  return undefined
}

@Injectable()
export class VerdictsClientService {
  constructor(
    private readonly goproVerdictApi: VerdictApi,
    private readonly supremeCourtApi: DefaultApi,
    private readonly goproCourtAgendasApi: BookingApi,
    private readonly goproLawyersApi: LawyerApi,
  ) {}

  async getVerdicts(input: {
    pageNumber: number
    searchTerm: string
    caseNumber?: string
    courtLevel?: string
    keywords?: string[]
    caseCategories?: string[]
    caseTypes?: string[]
    laws?: string[]
    dateFrom?: string
    dateTo?: string
  }) {
    const onlyFetchSupremeCourtVerdicts = input.courtLevel === 'Hæstiréttur'

    const [goproResponse, supremeCourtResponse] = await Promise.allSettled([
      !onlyFetchSupremeCourtVerdicts
        ? this.goproVerdictApi.getVerdicts({
            requestData: {
              orderBy: 'verdictDate desc',
              itemsPerPage: ITEMS_PER_PAGE,
              pageNumber: input.pageNumber,
              searchTerm: input.searchTerm,
              courtLevel: input.courtLevel,
              keywords: input.keywords,
              caseCategories: input.caseCategories,
              caseNumber: input.caseNumber,
              caseTypes: input.caseTypes,
              laws: input.laws,
              dateFrom: input.dateFrom ? input.dateFrom : undefined,
              dateTo: input.dateTo ? input.dateTo : undefined,
            },
          })
        : { status: 'rejected', items: [], total: 0 },
      !input.caseCategories?.length &&
      (!input.courtLevel || onlyFetchSupremeCourtVerdicts)
        ? this.supremeCourtApi.apiV2VerdictGetVerdictsPost({
            verdictSearchRequest: {
              page: input.pageNumber,
              limit: ITEMS_PER_PAGE,
              orderBy: 'publishDate DESC',
              searchTerm: input.searchTerm,
              keywords: input.keywords,
              caseNumber: input.caseNumber,
              caseTypes: input.caseTypes,
              laws: input.laws,
              dateFrom: safelyConvertStringToDate(input.dateFrom, 'dateFrom'),
              dateTo: safelyConvertStringToDate(input.dateTo, 'dateTo'),
            },
          })
        : { status: 'rejected', items: [], total: 0 },
    ])

    const items: {
      id: string
      title: string
      court: string
      caseNumber: string
      verdictDate?: Date | null
      presidentJudge?: { name?: string; title?: string }
      keywords: string[]
      presentings: string
    }[] = []

    if (goproResponse.status === 'fulfilled') {
      for (const goproItem of goproResponse.value.items ?? []) {
        items.push({
          id: goproItem.id ? `${GOPRO_ID_PREFIX}${goproItem.id}` : '',
          title: goproItem.title ?? '',
          court: goproItem.court ?? '',
          caseNumber: goproItem.caseNumber ?? '',
          verdictDate: goproItem.verdictDate,
          presidentJudge: goproItem.judges?.find((judge) =>
            Boolean(judge?.isPresident),
          ),
          keywords: goproItem.keywords ?? [],
          presentings: goproItem.presentings ?? '',
        })
      }
    }

    if (supremeCourtResponse.status === 'fulfilled') {
      for (const supremeCourtItem of supremeCourtResponse.value.items ?? []) {
        items.push({
          id: supremeCourtItem.id
            ? `${SUPREME_COURT_ID_PREFIX}${supremeCourtItem.id}`
            : '',
          title: supremeCourtItem.title ?? '',
          court: supremeCourtItem.court ?? '',
          caseNumber: supremeCourtItem.caseNumber ?? '',
          verdictDate: supremeCourtItem.publishDate,
          presidentJudge: supremeCourtItem.judges?.find((judge) =>
            Boolean(judge?.isPresident),
          ),
          keywords: supremeCourtItem.keywords ?? [],
          presentings: supremeCourtItem.presentings ?? '',
        })
      }
    }

    items.sort((a, b) => {
      if (!a.verdictDate && !b.verdictDate) return 0
      if (!b.verdictDate) return -1
      if (!a.verdictDate) return 1
      return (
        new Date(b.verdictDate).getTime() - new Date(a.verdictDate).getTime()
      )
    })

    return {
      total:
        Number(
          supremeCourtResponse.status === 'fulfilled'
            ? supremeCourtResponse.value.total ?? 0
            : 0,
        ) +
        Number(
          goproResponse.status === 'fulfilled'
            ? goproResponse.value.total ?? 0
            : 0,
        ),
      items,
    }
  }

  async getSingleVerdictById(id: string) {
    if (id.startsWith(GOPRO_ID_PREFIX)) {
      const response = await this.goproVerdictApi.getVerdict({
        id: id.slice(GOPRO_ID_PREFIX.length),
      })
      if (response.item?.docContent)
        return {
          item: {
            pdfString: response.item.docContent,
            title: response.item.title ?? '',
            court: response.item.court ?? '',
            verdictDate: response.item.verdictDate,
            caseNumber: response.item.caseNumber ?? '',
            keywords: response.item.keywords ?? [],
            presentings: response.item.presentings ?? '',
          },
        }
    } else if (id.startsWith(SUPREME_COURT_ID_PREFIX)) {
      const response = await this.supremeCourtApi.apiV2VerdictIdGet({
        id: id.slice(SUPREME_COURT_ID_PREFIX.length),
      })
      if (response.item?.verdictHtml)
        return {
          item: {
            richText: await convertHtmlToContentfulRichText(
              response.item.verdictHtml,
              'verdictHtml',
            ),
            title: response.item.title ?? '',
            court: response.item.court ?? '',
            verdictDate: response.item.publishDate,
            caseNumber: response.item.caseNumber ?? '',
            keywords: response.item.keywords ?? [],
            presentings: response.item.presentings ?? '',
          },
        }
    }

    return null
  }

  async getCaseTypes() {
    const [goproResponse, supremeCourtResponse] = await Promise.allSettled([
      this.goproVerdictApi.getCaseTypes({}),
      this.supremeCourtApi.apiV2VerdictGetCaseTypesGet(),
    ])

    const caseTypeSet = new Set<string>()

    if (goproResponse.status === 'fulfilled') {
      for (const caseType of goproResponse.value.items ?? []) {
        if (caseType.label) caseTypeSet.add(caseType.label)
      }
    }
    if (supremeCourtResponse.status === 'fulfilled') {
      for (const caseType of supremeCourtResponse.value.items ?? []) {
        if (caseType.label) caseTypeSet.add(caseType.label)
      }
    }

    const caseTypes = Array.from(caseTypeSet).map((caseType) => ({
      label: caseType,
    }))
    caseTypes.sort(sortAlpha('label'))

    return {
      caseTypes,
    }
  }

  async getCaseCategories() {
    const [goproResponse] = await Promise.allSettled([
      this.goproVerdictApi.getCaseCategories({}),
    ])

    const caseCategorySet = new Set<string>()

    if (goproResponse.status === 'fulfilled') {
      for (const caseCategory of goproResponse.value.items ?? []) {
        if (caseCategory.label) caseCategorySet.add(caseCategory.label)
      }
    }

    const caseCategories = Array.from(caseCategorySet).map((caseCategory) => ({
      label: caseCategory,
    }))
    caseCategories.sort(sortAlpha('label'))

    return {
      caseCategories,
    }
  }

  async getKeywords() {
    const [goproResponse, supremeCourtResponse] = await Promise.allSettled([
      this.goproVerdictApi.getKeywords({}),
      this.supremeCourtApi.apiV2VerdictGetKeywordsGet(),
    ])

    const keywordSet = new Set<string>()

    if (goproResponse.status === 'fulfilled') {
      for (const keyword of goproResponse.value.items ?? []) {
        if (keyword.label) keywordSet.add(keyword.label)
      }
    }
    if (supremeCourtResponse.status === 'fulfilled') {
      for (const keyword of supremeCourtResponse.value.items ?? []) {
        if (keyword.label) keywordSet.add(keyword.label)
      }
    }

    const keywords = Array.from(keywordSet).map((keyword) => ({
      label: keyword,
    }))
    keywords.sort(sortAlpha('label'))

    return {
      keywords,
    }
  }

  private safelyConvertDateToISOString(date: string | Date | null | undefined) {
    if (!date) return ''
    try {
      return new Date(date).toISOString()
    } catch (error) {
      return ''
    }
  }

  async getCourtAgendas(input: {
    page?: number
    court?: string
    dateFrom?: string
    dateTo?: string
  }) {
    const onlyFetchSupremeCourtAgendas = input.court === 'Hæstiréttur'
    const pageNumber = input.page ?? 1
    const itemsPerPage = 10

    const [supremeCourtResponse, goproResponse] = await Promise.allSettled([
      !input.court || onlyFetchSupremeCourtAgendas
        ? this.supremeCourtApi.apiV2VerdictGetAgendasPost({
            agendaSearchRequest: {
              page: pageNumber,
              limit: itemsPerPage,
              dateFrom: safelyConvertStringToDate(input.dateFrom, 'dateFrom'),
              dateTo: safelyConvertStringToDate(input.dateTo, 'dateTo'),
            },
          } as ApiV2VerdictGetAgendasPostRequest)
        : { status: 'rejected', items: [], total: 0 },
      onlyFetchSupremeCourtAgendas
        ? { status: 'rejected', items: [], total: 0 }
        : this.goproCourtAgendasApi.getPublishedBookings({
            pageNumber: pageNumber,
            court: input.court ?? '',
            itemsPerPage,
            dateFrom: input.dateFrom ? input.dateFrom : undefined,
            dateTo: input.dateTo ? input.dateTo : undefined,
          }),
    ])

    const items = []
    let total = 0

    if (supremeCourtResponse.status === 'fulfilled') {
      total += Number(supremeCourtResponse.value.total ?? 0)
      for (const agenda of supremeCourtResponse.value.items ?? []) {
        items.push({
          id: `${agenda.id}-${agenda.caseId}-${agenda.caseNumber}`,
          caseNumber: agenda.caseNumber ?? '',
          dateFrom: this.safelyConvertDateToISOString(agenda.verdictDate),
          dateTo: '',
          closedHearing: agenda.closedSession ?? false,
          courtRoom: agenda.courtroom ?? '',
          judges: agenda.judges ?? [],
          lawyers: [],
          court: 'Hæstiréttur',
          type: agenda.caseType ?? '',
          title: agenda.title ?? '',
        })
      }
    }
    if (goproResponse.status === 'fulfilled') {
      total += Number(goproResponse.value.total ?? 0)
      for (const agenda of goproResponse.value.items ?? []) {
        items.push({
          id: `${agenda.bookingId}-${agenda.caseId}-${agenda.caseNumberRaw}`,
          caseNumber: agenda.caseNumberRaw ?? '',
          dateFrom: this.safelyConvertDateToISOString(agenda.scheduleDate),
          dateTo: this.safelyConvertDateToISOString(agenda.scheduleToDate),
          closedHearing: agenda.closedHearing ?? false,
          courtRoom: agenda.courtRoom ?? '',
          judges: agenda.judges ?? [],
          lawyers: agenda.lawyers ?? [],
          court: (agenda as { court?: string }).court ?? '',
          type: agenda.bookingType ?? '',
          title: agenda.caseTitle?.raw ? agenda.caseTitle.raw : '',
        })
      }
    }

    return {
      items,
      total,
    }
  }

  private isLawyerValid(lawyer: {
    isRemovedFromLawyersList?: boolean
    recordID?: string
    name?: string
  }): lawyer is {
    isRemovedFromLawyersList?: boolean
    recordID: string
    name: string
  } {
    return (
      !lawyer?.isRemovedFromLawyersList &&
      Boolean(lawyer?.recordID) &&
      Boolean(lawyer.name)
    )
  }

  async getLawyers() {
    const response = await this.goproLawyersApi.getLawyers({})
    const items = (response.items ?? [])
      .filter(this.isLawyerValid)
      .map((lawyer) => ({
        id: lawyer.recordID,
        name: lawyer.name,
      }))
    items.sort(sortAlpha('name'))
    return items
  }
}
