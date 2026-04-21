import { Inject, Injectable } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import type { EnhancedFetchAPI } from '@island.is/clients/middlewares'
import { JSDOM } from 'jsdom'
import { VerdictsClientService } from '@island.is/clients/verdicts'
import { VerdictsInput } from './dto/verdicts.input'
import { VerdictByIdResponse, VerdictsResponse } from './dto/verdicts.response'
import { VerdictByIdInput } from './dto/verdictById.input'
import { CourtAgendasResponse } from './dto/courtAgendas.response'
import { CourtAgendasInput } from './dto/courtAgendas.input'
import { LawyersResponse } from './dto/lawyers.response'
import { CaseFilterOptionsResponse } from './dto/caseFilterOptions.response'
import { SupremeCourtDeterminationsInput } from './dto/supremeCourtDeterminations.input'
import { SupremeCourtDeterminationsResponse } from './dto/supremeCourtDeterminations.response'
import { SupremeCourtDeterminationByIdInput } from './dto/supremeCourtDeterminationById.input'
import { SupremeCourtDeterminationByIdResponse } from './dto/supremeCourtDeterminationById.response'
import { ScheduleTypesResponse } from './dto/scheduleTypes.response'
import { SupremeCourtAppealsInput } from './dto/supremeCourtAppeals.input'
import { SupremeCourtAppealsResponse } from './dto/supremeCourtAppeals.response'
import { CourtOfAppealAppealsResponse } from './dto/courtOfAppealAppeals.response'
import { VerdictsApiModuleConfig } from './verdicts.config'
import { VERDICTS_FETCH } from './verdicts.fetch'

@Injectable()
export class VerdictsService {
  constructor(
    private readonly verdictsClientService: VerdictsClientService,
    @Inject(VerdictsApiModuleConfig.KEY)
    private readonly config: ConfigType<typeof VerdictsApiModuleConfig>,
    @Inject(VERDICTS_FETCH)
    private readonly fetch: EnhancedFetchAPI,
  ) {}

  async getVerdicts(input: VerdictsInput): Promise<VerdictsResponse> {
    const response = await this.verdictsClientService.getVerdicts({
      searchTerm: input.searchTerm ?? '',
      pageNumber: input.page ?? 1,
      courtLevel: input.courtLevel,
      keywords: input.keywords,
      caseCategories: input.caseCategories,
      caseTypes: input.caseTypes,
      caseNumber: input.caseNumber,
      dateFrom: input.dateFrom,
      dateTo: input.dateTo,
      laws: input.laws,
      caseContact: input.caseContact,
      pageSize: input.pageSize,
    })
    return {
      items: response.items,
      total: response.total,
      input,
    }
  }

  async getVerdictById(
    input: VerdictByIdInput,
  ): Promise<VerdictByIdResponse | null> {
    return this.verdictsClientService.getSingleVerdictById(input.id)
  }

  async getCaseFilterOptionsPerCourt(): Promise<CaseFilterOptionsResponse> {
    return this.verdictsClientService.getCaseFilterOptionsPerCourt()
  }

  async getKeywords() {
    return this.verdictsClientService.getKeywords()
  }

  async getCourtAgendas(
    input: CourtAgendasInput,
  ): Promise<CourtAgendasResponse> {
    const { items, total } = await this.verdictsClientService.getCourtAgendas(
      input,
    )
    return {
      items,
      total,
      input,
    }
  }

  async getLawyers(): Promise<LawyersResponse> {
    return {
      lawyers: await this.verdictsClientService.getLawyers(),
    }
  }

  async getSupremeCourtDeterminations(
    input: SupremeCourtDeterminationsInput,
  ): Promise<SupremeCourtDeterminationsResponse> {
    return this.verdictsClientService.getSupremeCourtDeterminations(input)
  }

  async getSupremeCourtDeterminationById(
    input: SupremeCourtDeterminationByIdInput,
  ): Promise<SupremeCourtDeterminationByIdResponse | null> {
    return this.verdictsClientService.getSupremeCourtDeterminationById(input.id)
  }

  async getSupremeCourtAppeals(
    input: SupremeCourtAppealsInput,
  ): Promise<SupremeCourtAppealsResponse> {
    return this.verdictsClientService.getSupremeCourtAppeals(input)
  }

  async getCourtOfAppealAppeals(): Promise<CourtOfAppealAppealsResponse> {
    const items: CourtOfAppealAppealsResponse['items'] = []

    const response = await this.fetch(this.config.courtOfAppealAppealsUrl)
    const html = await response.text()
    const dom = new JSDOM(html)

    const cards = dom.window.document.querySelectorAll(
      '.sentence.box.sentencelist.clearfix',
    )

    for (let i = 0; i < cards.length; i++) {
      const card = cards.item(i)

      const caseNumber = card.querySelector('h2')?.textContent?.trim()
      if (!caseNumber) continue

      const appealDate = card.querySelector('.dags')?.textContent?.trim()

      const verdictDate = card
        .querySelector('.scheduled-info.green')
        ?.textContent?.trim()

      card.querySelector('.dags')?.remove()

      const title = card.querySelector('.casetitle')?.textContent?.trim() ?? ''

      items.push({
        id: String(i),
        title,
        caseNumber,
        appealDate,
        verdictDate,
      })
    }

    return {
      items,
      total: items.length,
    }
  }

  async getScheduleTypes(): Promise<ScheduleTypesResponse> {
    return this.verdictsClientService.getScheduleTypes()
  }
}
