import { Injectable } from '@nestjs/common'
import {
  ElasticService,
  GroupedRankEvaluationResponse,
  rankEvaluationMetrics,
} from '@island.is/content-search-toolkit'
import { RankedDataService, searchTermsUnion } from './rankedData.service'
import { MetricInput } from './dto/metricInput'

type additionalFields = 'testCase' | 'legends'

export interface RankEvaluationFormattedResponse {
  totalScore: number
  terms: {
    [term in searchTermsUnion]: {
      score: number
      dcg: number
      precision: number
      testCase?: string
    }
  }
  legends?: {
    dcg: string
    precision: string
  }
}

interface GetMetricMetricScoreInput {
  data: GroupedRankEvaluationResponse<searchTermsUnion>
  metric: rankEvaluationMetrics
}

interface GetTermMetricScoreInput extends GetMetricMetricScoreInput {
  term: searchTermsUnion
}

interface AllMetricVariants {
  [metric: string]: searchTermsUnion[]
}

@Injectable()
export class MetricsService {
  metrics: rankEvaluationMetrics[]
  constructor(
    private readonly elasticService: ElasticService,
    private readonly rankedDataService: RankedDataService,
  ) {
    this.metrics = ['dcg', 'precision']
  }

  private getTermMetricScore({ data, metric, term }: GetTermMetricScoreInput) {
    return data[metric].details[term].metric_score
  }

  private getMetricMetricScore({ data, metric }: GetMetricMetricScoreInput) {
    return data[metric].metric_score
  }

  private getAllMetricVariants() {
    return this.metrics.reduce((metricTermMap: AllMetricVariants, metric) => {
      metricTermMap[metric] = this.rankedDataService.getTerms()
      return metricTermMap
    }, {})
  }

  private formatResponse(
    response: GroupedRankEvaluationResponse<searchTermsUnion>,
    additionalFields: additionalFields[] = [],
  ): RankEvaluationFormattedResponse {
    const allMetricVariants = this.getAllMetricVariants()
    const formattedResults = Object.entries(allMetricVariants).reduce(
      (results: RankEvaluationFormattedResponse, [metric, terms], index) => {
        // on the last metric we want to divide by metric count in some values to get the average score
        let divider: number
        if (index === this.metrics.length - 1) {
          divider = this.metrics.length
        } else {
          divider = 1
        }

        results.totalScore =
          (results.totalScore +
            this.getMetricMetricScore({
              data: response,
              metric: metric as rankEvaluationMetrics,
            })) /
          divider
        terms.map((term) => {
          // if term object does not exist we have to initiate it
          if (!results.terms[term]) {
            results.terms[term] = { score: 0, dcg: 0, precision: 0 }
          }

          // we dig into results to get this specific metric
          const termMetricScore = this.getTermMetricScore({
            data: response,
            metric: metric as rankEvaluationMetrics,
            term,
          })
          results.terms[term][metric as rankEvaluationMetrics] = termMetricScore // add this metric score to the term result object
          results.terms[term].score =
            (results.terms[term].score + termMetricScore) / divider // sum up the total metric score for this term

          // we add the test case if requested
          if (additionalFields.includes('testCase')) {
            results.terms[term].testCase =
              this.rankedDataService.getTermTestCase(term)
          }
        })

        if (additionalFields.includes('legends')) {
          results.legends = {
            dcg: 'Shows if our search is ranking the documents well. Calculated based on presence of document in top X search results weight against their position in list. Higher score means higher rated documents near the top',
            precision:
              'Shows if our ranked documents show up in top results. Calculated based on presence of document in top X search results. Higher score means more desired documents present somewhere in top X documents',
          }
        }
        return results
      },
      { totalScore: 0, terms: {} } as RankEvaluationFormattedResponse,
    )

    formattedResults.totalScore =
      formattedResults.totalScore / this.metrics.length // find the average of all metrics
    return formattedResults
  }

  private formatRankEvaluationResponse(
    response: GroupedRankEvaluationResponse<searchTermsUnion>,
    display: MetricInput['display'],
  ):
    | RankEvaluationFormattedResponse
    | GroupedRankEvaluationResponse<searchTermsUnion> {
    switch (display) {
      case 'raw': {
        return response
      }
      case 'minimal': {
        return this.formatResponse(response)
      }
      default:
      case 'descriptive': {
        return this.formatResponse(response, ['testCase', 'legends'])
      }
    }
  }

  async getCMSRankEvaluation({ index, display }: MetricInput) {
    const response =
      await this.elasticService.getRankEvaluation<searchTermsUnion>(
        index,
        this.rankedDataService.getTermRatings(index),
        this.metrics,
      )
    return this.formatRankEvaluationResponse(response, display)
  }
}
