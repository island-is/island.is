import { Injectable } from '@nestjs/common'
import { ElasticService } from '@island.is/content-search-toolkit'
import { RankEvaluationResponse } from '@island.is/shared/types'
import { RankedDataService, searchTermsUnion } from './rankedData.service'

interface GetCMSRankEvaluationInput {
  display: 'raw' | 'minimal'
  index: string
}

export interface RankEvaluationFormattedResponse {
  totalScore: number
  terms: {
    [term in searchTermsUnion]: { score: number; dcg: number; testCase: string }
  }
}

@Injectable()
export class MetricsService {
  constructor(
    private readonly elasticService: ElasticService,
    private readonly rankedDataService: RankedDataService,
  ) {}

  formatRankEvaluationResponse(
    response: RankEvaluationResponse<searchTermsUnion>,
  ): RankEvaluationFormattedResponse {
    return {
      totalScore: response.metric_score,
      terms: Object.entries(response.details).reduce(
        (terms, [term, result]) => {
          terms[term as searchTermsUnion] = {
            score: result.metric_score,
            dcg: result.metric_details.dcg.normalized_dcg,
            testCase: this.rankedDataService.getTermTestCase(
              term as searchTermsUnion,
            ),
          }
          return terms
        },
        {} as RankEvaluationFormattedResponse['terms'],
      ),
    }
  }

  async getCMSRankEvaluation({ index, display }: GetCMSRankEvaluationInput) {
    const response = await this.elasticService.getRankEvaluation<
      searchTermsUnion
    >(index, { termRatings: this.rankedDataService.getTermRatings(index) })
    if (display === 'raw') {
      return response
    } else {
      return this.formatRankEvaluationResponse(response)
    }
  }
}
