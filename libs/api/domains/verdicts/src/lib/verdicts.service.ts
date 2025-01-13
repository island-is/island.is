import { Injectable } from '@nestjs/common'
import { VerdictsClientService } from '@island.is/clients/verdicts'
import { VerdictsInput } from './dto/verdicts.input'
import { VerdictByIdResponse, VerdictsResponse } from './dto/verdicts.response'
import { VerdictByIdInput } from './dto/verdictById.input'

@Injectable()
export class VerdictsService {
  constructor(private readonly verdictsClientService: VerdictsClientService) {}

  async getVerdicts(input: VerdictsInput): Promise<VerdictsResponse> {
    const response = await this.verdictsClientService.getVerdicts({
      searchTerm: input.searchTerm,
    })
    return {
      items: response.items,
      input,
    }
  }

  async getVerdictById(
    input: VerdictByIdInput,
  ): Promise<VerdictByIdResponse | null> {
    const response = await this.verdictsClientService.getSingleVerdictById(
      input.id,
    )

    return response
  }
}
