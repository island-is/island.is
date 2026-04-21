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
    const rawResponse = await this.rulingsApi.getRulingPdfRaw({ id })
    const response = rawResponse.raw
    const contentType = response.headers.get('content-type') ?? ''

    let base64: string
    if (contentType.includes('application/pdf')) {
      // API returns raw PDF bytes — convert to base64
      const buffer = await response.arrayBuffer()
      base64 = Buffer.from(buffer).toString('base64')
    } else {
      // API returns base64-encoded string
      base64 = await response.text()
    }

    return {
      base64,
      contentType: 'application/pdf',
    }
  }
}
