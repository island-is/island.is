import { Injectable } from '@nestjs/common'
import { RulingsApi } from '@island.is/clients/one-systems-complaints-committee-rulings'
import {
  OneSystemsRulingsResponse,
  OneSystemsRulingPdfResponse,
} from './graphql/models'
import { GetOneSystemsRulingsInput } from './graphql/dto'

@Injectable()
export class OneSystemsRulingsService {
  constructor(private readonly rulingsApi: RulingsApi) {}

  async getRulings(
    input: GetOneSystemsRulingsInput,
  ): Promise<OneSystemsRulingsResponse> {
    const response = await this.rulingsApi.getRulings({
      year: input.year,
      limit: input.limit,
      offset: input.offset,
    })

    return {
      rulings: (response.rulings ?? []).map((ruling) => ({
        id: ruling.id ?? '',
        title: ruling.title ?? '',
        description: ruling.description ?? '',
        publishedDate: ruling.publishedDate ?? null,
      })),
      totalCount: response.totalCount ?? 0,
    }
  }

  async getRulingPdf(id: string): Promise<OneSystemsRulingPdfResponse> {
    const pdfData = await this.rulingsApi.getRulingPdf({ id })

    return {
      base64: pdfData,
      contentType: 'application/pdf',
    }
  }
}
