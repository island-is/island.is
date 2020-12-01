import { SearchIndexes } from '@island.is/content-search-indexer/types'
import { String } from 'aws-sdk/clients/batch';

export interface Rating {
  _index: String,
  _id: string,
  rating: 1 | 2 | 3
}

export interface RankEvaluationInput {
  termRatings: { [searchTerm: string]: Rating[] }
}