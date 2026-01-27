import { Injectable } from '@nestjs/common'
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

@Injectable()
export class VerdictsService {
  constructor(private readonly verdictsClientService: VerdictsClientService) {}

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
}
