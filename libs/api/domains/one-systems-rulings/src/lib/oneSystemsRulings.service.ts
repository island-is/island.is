import { Injectable } from '@nestjs/common'
import { ComplaintsCommitteeRulingsClientService } from '@island.is/clients/one-systems-complaints-committee-rulings'
import {
  OneSystemsRulingsResponse,
  OneSystemsRulingPdfResponse,
} from './graphql/models'
import { GetOneSystemsRulingsInput } from './graphql/dto'

@Injectable()
export class OneSystemsRulingsService {
  constructor(
    private readonly rulingsClient: ComplaintsCommitteeRulingsClientService,
  ) {}

  async getRulings(
    input: GetOneSystemsRulingsInput,
  ): Promise<OneSystemsRulingsResponse> {
    const response = await this.rulingsClient.getRulings({
      year: input.year,
      limit: input.limit,
      offset: input.offset,
    })

    return {
      rulings: response.rulings.map((ruling) => ({
        id: ruling.id,
        title: ruling.title,
        description: ruling.description,
        publishedDate: ruling.publishedDate,
      })),
      totalCount: response.totalCount,
    }
  }

  async getRulingPdf(id: string): Promise<OneSystemsRulingPdfResponse> {
    const pdfData = await this.rulingsClient.getRulingPdf(id)

    // The API returns the PDF as a base64 string or raw data
    return {
      base64: pdfData,
      contentType: 'application/pdf',
    }
  }
}
