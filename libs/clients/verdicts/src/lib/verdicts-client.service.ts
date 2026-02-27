import { Inject, Injectable } from '@nestjs/common'
import sanitizeHtml from 'sanitize-html'
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown'
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { isValidDate, sortAlpha } from '@island.is/shared/utils'
import isUrl from 'is-url'

import {
  ExtensionPublishedVerdictApi,
  ExtensionPublishedBookingApi,
  ExtensionLawyerApi,
  ExternalIntegrationAPISecurityApi,
} from '../../gen/fetch/gopro'
import {
  type ApiV2VerdictGetAgendasPostRequest,
  DefaultApi,
} from '../../gen/fetch/supreme-court'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { VerdictsClientConfig } from './verdicts-client.config'
import type { ConfigType } from '@nestjs/config'
import { AuthHeaderMiddleware } from '@island.is/auth-nest-tools'
import { CaseFilterOptionType } from './types'
import {
  ALL_DISTRICT_COURTS,
  COURT_OF_APPEAL,
  SUPREME_COURT,
} from './constants'

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
  logger: Logger,
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
    private readonly goproVerdictApi: ExtensionPublishedVerdictApi,
    private readonly supremeCourtApi: DefaultApi,
    private readonly goproCourtAgendasApi: ExtensionPublishedBookingApi,
    private readonly goproLawyersApi: ExtensionLawyerApi,
    private readonly goproAuthenticationApi: ExternalIntegrationAPISecurityApi,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(VerdictsClientConfig.KEY)
    private readonly config: ConfigType<typeof VerdictsClientConfig>,
  ) {}

  private async getAuthenticatedGoproApis() {
    let bearerToken = await this.goproAuthenticationApi.authenticateV2({
      credentials: {
        username: this.config.goproUsername,
        password: this.config.goproPassword,
      },
    })
    if (bearerToken.startsWith('"') && bearerToken.endsWith('"'))
      bearerToken = bearerToken.slice(1, -1)

    const middleware = new AuthHeaderMiddleware(`Bearer ${bearerToken}`)

    return {
      goproVerdictApi: this.goproVerdictApi.withMiddleware(middleware),
      goproCourtAgendasApi:
        this.goproCourtAgendasApi.withMiddleware(middleware),
      goproLawyersApi: this.goproLawyersApi.withMiddleware(middleware),
    }
  }

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
    caseContact?: string
  }) {
    const onlyFetchSupremeCourtVerdicts = input.courtLevel === SUPREME_COURT

    const { goproVerdictApi } = await this.getAuthenticatedGoproApis()

    const [goproResponse, supremeCourtResponse] = await Promise.allSettled([
      !onlyFetchSupremeCourtVerdicts
        ? goproVerdictApi.getVerdictsV2({
            requestData: {
              orderBy: 'verdictDate desc',
              itemsPerPage: ITEMS_PER_PAGE,
              pageNumber: input.pageNumber,
              searchTerm: input.searchTerm,
              courts: input.courtLevel ? input.courtLevel.split(',') : [],
              keywords: input.keywords,
              caseCategories: input.caseCategories,
              caseNumber: input.caseNumber,
              caseTypes: input.caseTypes,
              laws: input.laws,
              dateFrom: input.dateFrom ? input.dateFrom : undefined,
              dateTo: input.dateTo ? input.dateTo : undefined,
              caseContact: input.caseContact,
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
              dateFrom: safelyConvertStringToDate(
                input.dateFrom,
                'dateFrom',
                this.logger,
              ),
              dateTo: safelyConvertStringToDate(
                input.dateTo,
                'dateTo',
                this.logger,
              ),
              caseContact: input.caseContact,
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
        const judges = goproItem.judges ?? []
        let presidentJudge = judges.find((judge) => Boolean(judge?.isPresident))
        if (judges.length === 1) presidentJudge = judges[0]
        items.push({
          id: goproItem.id ? `${GOPRO_ID_PREFIX}${goproItem.id}` : '',
          title: goproItem.title ?? '',
          court: goproItem.court?.name ?? '',
          caseNumber: goproItem.caseNumber ?? '',
          verdictDate: goproItem.verdictDate,
          presidentJudge,
          keywords: goproItem.keywords ?? [],
          presentings: goproItem.presentings ?? '',
        })
      }
    }

    if (supremeCourtResponse.status === 'fulfilled') {
      for (const supremeCourtItem of supremeCourtResponse.value.items ?? []) {
        const judges = supremeCourtItem.judges ?? []
        let presidentJudge = judges.find((judge) => Boolean(judge?.isPresident))
        if (judges.length === 1) presidentJudge = judges[0]
        items.push({
          id: supremeCourtItem.id
            ? `${SUPREME_COURT_ID_PREFIX}${supremeCourtItem.id}`
            : '',
          title: supremeCourtItem.title ?? '',
          court: supremeCourtItem.court ?? '',
          caseNumber: supremeCourtItem.caseNumber ?? '',
          verdictDate: supremeCourtItem.publishDate,
          presidentJudge,
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
      const { goproVerdictApi } = await this.getAuthenticatedGoproApis()
      const response = await goproVerdictApi.getVerdictV2({
        id: id.slice(GOPRO_ID_PREFIX.length),
      })
      if (response.item?.docContent)
        return {
          item: {
            pdfString: response.item.docContent,
            title: response.item.title ?? '',
            court: response.item.court?.name ?? '',
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
            resolutionLink:
              response.item.resolutionLink &&
              isUrl(response.item.resolutionLink) &&
              response.item.resolutionLink.toLowerCase().startsWith('http')
                ? response.item.resolutionLink
                : '',
          },
        }
    }

    return null
  }

  async getCaseFilterOptionsPerCourt() {
    const { goproVerdictApi } = await this.getAuthenticatedGoproApis()
    const [courtOfAppealResponse, supremeCourtResponse, districtCourtResponse] =
      await Promise.allSettled([
        goproVerdictApi.getCaseTypesV2({
          requestData: {
            courts: [COURT_OF_APPEAL],
          },
        }),
        this.supremeCourtApi.apiV2VerdictGetCaseTypesGet(),
        goproVerdictApi.getCaseTypesV2({
          requestData: {
            courts: ALL_DISTRICT_COURTS,
          },
        }),
      ])

    const mapOfAll = new Map<string, CaseFilterOptionType>()

    const courtOfAppealSet = new Set<string>()
    if (courtOfAppealResponse.status === 'fulfilled')
      for (const caseType of courtOfAppealResponse.value.items ?? [])
        if (caseType.label) {
          mapOfAll.set(caseType.label, CaseFilterOptionType.CaseType)
          courtOfAppealSet.add(caseType.label)
        }

    const supremeCourtSet = new Set<string>()
    if (supremeCourtResponse.status === 'fulfilled')
      for (const caseType of supremeCourtResponse.value.items ?? [])
        if (caseType.label) {
          mapOfAll.set(caseType.label, CaseFilterOptionType.CaseType)
          supremeCourtSet.add(caseType.label)
        }

    const districtCourtSet = new Set<string>()
    if (districtCourtResponse.status === 'fulfilled')
      for (const caseType of districtCourtResponse.value.items ?? [])
        if (caseType.label) {
          mapOfAll.set(caseType.label, CaseFilterOptionType.CaseType)
          districtCourtSet.add(caseType.label)
        }

    const courtOfAppealOptions = Array.from(courtOfAppealSet).map((label) => ({
      label,
      typeOfOption: CaseFilterOptionType.CaseType,
    }))
    courtOfAppealOptions.sort(sortAlpha('label'))
    const supremeCourtOptions = Array.from(supremeCourtSet).map((label) => ({
      label,
      typeOfOption: CaseFilterOptionType.CaseType,
    }))
    supremeCourtOptions.sort(sortAlpha('label'))
    const districtCourtOptions = Array.from(districtCourtSet).map((label) => ({
      label,
      typeOfOption: CaseFilterOptionType.CaseType,
    }))
    districtCourtOptions.sort(sortAlpha('label'))

    const allOptions = Array.from(mapOfAll, ([label, typeOfOption]) => ({
      label,
      typeOfOption,
    }))
    allOptions.sort(sortAlpha('label'))

    return {
      courtOfAppeal: {
        options: courtOfAppealOptions,
      },
      supremeCourt: {
        options: supremeCourtOptions,
      },
      districtCourt: {
        options: districtCourtOptions,
      },
      all: {
        options: allOptions,
      },
    }
  }

  async getKeywords() {
    const { goproVerdictApi } = await this.getAuthenticatedGoproApis()
    const [goproResponse, supremeCourtResponse] = await Promise.allSettled([
      goproVerdictApi.getKeywordsV2(),
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

  private getDefaultDateFrom() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return {
      date: today,
      dateString: today.toISOString(),
    }
  }

  async getCourtAgendas(input: {
    page?: number
    court?: string
    dateFrom?: string
    dateTo?: string
    lawyer?: string
    scheduleTypes?: string[]
    caseTypes?: string[]
  }) {
    const onlyFetchSupremeCourtAgendas = input.court === SUPREME_COURT
    const pageNumber = input.page ?? 1
    const itemsPerPage = 10

    const { goproCourtAgendasApi } = await this.getAuthenticatedGoproApis()

    const [supremeCourtResponse, goproResponse] = await Promise.allSettled([
      (!input.court && !input.scheduleTypes?.length) ||
      onlyFetchSupremeCourtAgendas
        ? this.supremeCourtApi.apiV2VerdictGetAgendasPost({
            agendaSearchRequest: {
              page: pageNumber,
              limit: itemsPerPage,
              dateFrom: input.dateFrom
                ? safelyConvertStringToDate(
                    input.dateFrom,
                    'dateFrom',
                    this.logger,
                  )
                : !input.dateTo
                ? this.getDefaultDateFrom().date
                : undefined,
              dateTo: safelyConvertStringToDate(
                input.dateTo,
                'dateTo',
                this.logger,
              ),
              lawyer: input.lawyer ? input.lawyer : undefined,
              orderBy: 'verdictDate ASC',
              caseTypes: input.caseTypes ? input.caseTypes : undefined,
            },
          } as ApiV2VerdictGetAgendasPostRequest)
        : { status: 'rejected', items: [], total: 0 },
      onlyFetchSupremeCourtAgendas
        ? { status: 'rejected', items: [], total: 0 }
        : goproCourtAgendasApi.getPublishedBookingsV2({
            pageNumber: pageNumber,
            courts: input.court ? input.court.split(',') : [],
            itemsPerPage,
            dateFrom: input.dateFrom
              ? input.dateFrom
              : !input.dateTo
              ? this.getDefaultDateFrom().dateString
              : undefined,
            dateTo: input.dateTo ? input.dateTo : undefined,
            lawyer: input.lawyer ? input.lawyer : undefined,
            orderBy: 'StartDateTime',
            orderDirection: 'ASC',
            scheduleType: input.scheduleTypes ? input.scheduleTypes : undefined,
            caseType: input.caseTypes ? input.caseTypes : undefined,
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
          court: SUPREME_COURT,
          type: '',
          title: agenda.title ?? '',
        })
      }
    } else {
      this.logger.error('Failed to fetch supreme court agendas', {
        error: supremeCourtResponse.reason,
      })
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
          court: agenda.court?.name ?? '',
          type: agenda.bookingType ?? '',
          title: agenda.caseTitle?.raw ? agenda.caseTitle.raw : '',
          caseSubType: agenda.caseSubType ?? '',
        })
      }
    } else {
      this.logger.error('Failed to fetch gopro agendas', {
        error: goproResponse.reason,
      })
    }

    items.sort((a, b) => {
      if (!a.dateFrom && !b.dateFrom) return 0
      if (!b.dateFrom) return 1
      if (!a.dateFrom) return -1

      const dateFromDiff =
        new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime()
      if (dateFromDiff !== 0) return dateFromDiff

      if (!a.dateTo && !b.dateTo) return 0
      if (!b.dateTo) return 1
      if (!a.dateTo) return -1
      return new Date(a.dateTo).getTime() - new Date(b.dateTo).getTime()
    })

    return {
      items,
      total,
    }
  }

  private async getSupremeCourtLawyers(lawyerNameSet: Set<string>) {
    const pageSize = 1000
    let page = 1

    let response = await this.supremeCourtApi.apiV2VerdictGetLawyersGet({
      limit: pageSize,
      page,
    })
    for (const lawyer of response.items ?? [])
      if (lawyer?.name) lawyerNameSet.add(lawyer.name)

    while (
      typeof response.total === 'number' &&
      response.total > pageSize * page
    ) {
      page += 1
      response = await this.supremeCourtApi.apiV2VerdictGetLawyersGet({
        limit: pageSize,
        page,
      })
      for (const lawyer of response.items ?? [])
        if (lawyer?.name) lawyerNameSet.add(lawyer.name)
    }

    return lawyerNameSet
  }

  async getLawyers() {
    const { goproLawyersApi } = await this.getAuthenticatedGoproApis()

    const lawyerNameSet = new Set<string>()

    const [goproResponse, supremeCourtResponse] = await Promise.allSettled([
      goproLawyersApi.getLawyersV2(),
      this.getSupremeCourtLawyers(lawyerNameSet),
    ])

    if (goproResponse.status === 'fulfilled')
      for (const lawyer of goproResponse.value.items ?? [])
        if (Boolean(lawyer?.name) && !lawyer.isRemovedFromLawyersList)
          lawyerNameSet.add(lawyer.name as string)

    if (goproResponse.status === 'rejected')
      this.logger.error('Failed to fetch gopro lawyers', {
        error: goproResponse.reason,
      })

    if (supremeCourtResponse.status === 'rejected')
      this.logger.error('Failed to fetch supreme court lawyers', {
        error: supremeCourtResponse.reason,
      })

    const lawyers = Array.from(lawyerNameSet).map((name) => ({
      id: name,
      name,
    }))

    lawyers.sort(sortAlpha('name'))
    return lawyers
  }

  async getSupremeCourtDeterminations(input: { page: number }) {
    const response =
      await this.supremeCourtApi.apiV2VerdictGetDeterminationsGet({
        page: input.page ?? 1,
        limit: 10,
      })

    return {
      total: Number(response.total ?? 0),
      items: (response.items ?? [])
        .filter(
          (item) =>
            Boolean(item.id) &&
            Boolean(item.title) &&
            Boolean(item.caseNumber) &&
            Boolean(item.publishDate),
        )
        .map((item) => ({
          id: item.id as string,
          title: item.title as string,
          caseNumber: item.caseNumber as string,
          date: item.publishDate as Date,
          keywords: item.keywords ?? [],
        })),
      input,
    }
  }

  async getSupremeCourtDeterminationById(id: string) {
    const response =
      await this.supremeCourtApi.apiV2VerdictGetDeterminationIdGet({
        id,
      })
    if (
      !response.item?.id ||
      !response.item?.title ||
      !response.item?.caseNumber ||
      !response.item?.publishDate
    )
      return null
    return {
      item: {
        id: response.item?.id as string,
        title: response.item?.title as string,
        caseNumber: response.item?.caseNumber as string,
        date: response.item?.publishDate as Date,
        presentings: response.item?.presentings ?? '',
        keywords: response.item?.keywords ?? [],
        richText: await convertHtmlToContentfulRichText(
          response.item?.verdictHtml ?? '',
          'verdictHtml',
        ),
      },
    }
  }
  async getScheduleTypes() {
    const { goproCourtAgendasApi } = await this.getAuthenticatedGoproApis()
    const [courtOfAppealResponse, districtCourtResponse] =
      await Promise.allSettled([
        goproCourtAgendasApi.getScheduleTypeV2({
          courts: [COURT_OF_APPEAL],
        }),
        goproCourtAgendasApi.getScheduleTypeV2({
          courts: ALL_DISTRICT_COURTS,
        }),
      ])

    const mapOfAll = new Map<string, { id: string; label: string }>()

    const courtOfAppealItems: Array<{ id: string; label: string }> = []
    if (courtOfAppealResponse.status === 'fulfilled')
      for (const scheduleType of courtOfAppealResponse.value.items ?? [])
        if (scheduleType.label && scheduleType.id !== undefined) {
          const id = String(scheduleType.id)
          const item = { id, label: scheduleType.label }
          if (!mapOfAll.has(scheduleType.label)) {
            mapOfAll.set(scheduleType.label, item)
          }
          courtOfAppealItems.push(item)
        }

    const supremeCourtItems: Array<{ id: string; label: string }> = []

    const districtCourtItems: Array<{ id: string; label: string }> = []
    if (districtCourtResponse.status === 'fulfilled')
      for (const scheduleType of districtCourtResponse.value.items ?? [])
        if (scheduleType.label && scheduleType.id !== undefined) {
          const id = String(scheduleType.id)
          const item = { id, label: scheduleType.label }
          if (!mapOfAll.has(scheduleType.label)) {
            mapOfAll.set(scheduleType.label, item)
          }
          districtCourtItems.push(item)
        }

    courtOfAppealItems.sort(sortAlpha('label'))
    districtCourtItems.sort(sortAlpha('label'))

    const allItems = Array.from(mapOfAll.values())
    allItems.sort(sortAlpha('label'))

    return {
      courtOfAppeal: {
        items: courtOfAppealItems,
      },
      supremeCourt: {
        items: supremeCourtItems,
      },
      districtCourt: {
        items: districtCourtItems,
      },
      all: {
        items: allItems,
      },
    }
  }

  async getScheduleTypesPerCourt(input: { courts?: string[] }) {
    const { goproCourtAgendasApi } = await this.getAuthenticatedGoproApis()
    const response = await goproCourtAgendasApi.getScheduleTypeV2({
      courts: input.courts,
    })
    return {
      items: response.items ?? [],
    }
  }
}
