import { RankEvaluationResponse } from '@island.is/shared/types'

export interface Rating {
  _index: string
  _id: string
  rating: 1 | 2 | 3
}

export type rankEvaluationMetrics = 'precision' | 'dcg'

export interface RankEvaluationInput {
  termRatings: { [searchTerm: string]: Rating[] }
  metric: rankEvaluationMetrics
}

export interface GroupedRankEvaluationResponse<SearchTermUnion extends string> {
  [metric: string]: RankEvaluationResponse<SearchTermUnion>
}
