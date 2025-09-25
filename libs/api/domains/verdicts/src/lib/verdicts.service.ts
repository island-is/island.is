import { Injectable } from '@nestjs/common'
import { VerdictsClientService } from '@island.is/clients/verdicts'
import { VerdictsInput } from './dto/verdicts.input'
import { VerdictByIdResponse, VerdictsResponse } from './dto/verdicts.response'
import { VerdictByIdInput } from './dto/verdictById.input'
import { CourtAgendasResponse } from './dto/courtAgendas.response'
import { CourtAgendasInput } from './dto/courtAgendas.input'
import { LawyersResponse } from './dto/lawyers.response'

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

  async getCaseTypes() {
    return this.verdictsClientService.getCaseTypes()
  }

  async getCaseCategories() {
    return this.verdictsClientService.getCaseCategories()
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
}
