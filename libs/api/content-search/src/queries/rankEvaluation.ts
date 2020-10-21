interface Rating {
  _index: string
  _id: string
  rating: number
}

export interface Request {
  id: string
  request: object | string
  ratings: Rating[]
}

interface Precision {
  precision: {
    k: number
    relevant_rating_threshold: number
    ignore_unlabeled: boolean
  }
}

interface Recall {
  recall: {
    k: number
    relevant_rating_threshold: number
  }
}

interface DCG {
  dcg: {
    k: number
    normalize: boolean
  }
}

interface ERR {
  expected_reciprocal_rank: {
    maximum_relevance: number
    k: number
  }
}

interface MeanReciprocalRank {
  mean_reciprocal_rank: {
    k: number
    relevant_rating_threshold: number
  }
}

export interface RankQuery {
  requests: Request[]
  metric: Precision | Recall | DCG | ERR | MeanReciprocalRank
}

// https://www.elastic.co/guide/en/elasticsearch/reference/current/search-rank-eval.html#k-recall
export const recallEvaluation = (
  requests: Request[],
  size = 10,
  threshold = 1,
): RankQuery => {
  return {
    requests,
    metric: {
      recall: {
        k: size,
        // eslint-disable-next-line @typescript-eslint/camelcase
        relevant_rating_threshold: threshold,
      },
    },
  }
}

// https://www.elastic.co/guide/en/elasticsearch/reference/current/search-rank-eval.html#k-precision
export const precisionEvaluation = (
  requests: Request[],
  size = 10,
  threshold = 1,
  ignoreUnlabeled = false,
): RankQuery => {
  return {
    requests,
    metric: {
      precision: {
        k: size,
        // eslint-disable-next-line @typescript-eslint/camelcase
        relevant_rating_threshold: threshold,
        // eslint-disable-next-line @typescript-eslint/camelcase
        ignore_unlabeled: ignoreUnlabeled,
      },
    },
  }
}

// https://www.elastic.co/guide/en/elasticsearch/reference/current/search-rank-eval.html#_mean_reciprocal_rank
export const meanReciprocalEvaluation = (
  requests: Request[],
  size = 10,
  threshold = 1,
): RankQuery => {
  return {
    requests,
    metric: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      mean_reciprocal_rank: {
        k: size,
        // eslint-disable-next-line @typescript-eslint/camelcase
        relevant_rating_threshold: threshold,
      },
    },
  }
}

// https://www.elastic.co/guide/en/elasticsearch/reference/current/search-rank-eval.html#_discounted_cumulative_gain_dcg
export const dcgEvaluation = (
  requests: Request[],
  size = 10,
  normalize = false,
): RankQuery => {
  return {
    requests,
    metric: {
      dcg: {
        k: size,
        normalize,
      },
    },
  }
}

// https://www.elastic.co/guide/en/elasticsearch/reference/current/search-rank-eval.html#_expected_reciprocal_rank_err
export const errEvaluation = (
  requests: Request[],
  maxRelevance: number,
  size = 10,
): RankQuery => {
  return {
    requests,
    metric: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      expected_reciprocal_rank: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        maximum_relevance: maxRelevance,
        k: size,
      },
    },
  }
}
