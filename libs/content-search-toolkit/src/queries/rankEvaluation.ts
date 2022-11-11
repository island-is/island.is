import { RankEvaluationInput } from '../types'
import { searchQuery } from './search'

export const rankEvaluationQuery = ({
  termRatings,
  metric,
}: RankEvaluationInput) => {
  let metricQuery
  if (metric === 'dcg') {
    metricQuery = {
      dcg: {
        normalize: true,
        k: 5,
      },
    }
  } else {
    metricQuery = {
      precision: {
        k: 5,
      },
    }
  }

  return {
    templates: [
      {
        id: 'search_query',
        template: {
          source: searchQuery(
            { queryString: '{{query_string}}' },
            false,
            false,
          ),
        },
      },
    ],
    requests: Object.entries(termRatings).map(([searchTerm, ratings]) => ({
      id: searchTerm,
      template_id: 'search_query',
      params: {
        query_string: searchTerm,
      },
      ratings,
    })),
    metric: metricQuery,
  }
}
