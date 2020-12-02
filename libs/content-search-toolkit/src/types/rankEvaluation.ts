export interface Rating {
  _index: string
  _id: string
  rating: 1 | 2 | 3
}

export interface RankEvaluationInput {
  termRatings: { [searchTerm: string]: Rating[] }
}
