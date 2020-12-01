import { RankEvaluationInput } from '../types'
import { searchQuery } from './search'

export const rankEvaluationQuery = ({
  termRatings
}: RankEvaluationInput) => ({
  templates: [
    {
      id: 'search_query',
      template: {
        source: searchQuery({ queryString: '{{query_string}}' })
      }
    }
  ],
  requests: Object.entries(termRatings).map(([searchTerm, ratings]) => (
    {
      id: searchTerm,
      template_id: 'search_query',
      params: {
        query_string: searchTerm
      },
      ratings
    })
  ),
  metric: {
    dcg: {
      normalize: true,
      k: 5
    }
  }
})
