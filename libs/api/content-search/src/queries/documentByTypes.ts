import { sortableFields } from '../types'

export interface DocumentByTypesInput {
  types: string[]
  sort?: sortableFields
  size?: number
}

export interface SearchRequestBody {
  query: {
    terms: {
      type: string[]
    }
  },
  sort: sortableFields[],
  size: Number
}

export const documentByTypeQuery = ({ types, sort = {}, size = 10 }: DocumentByTypesInput): SearchRequestBody => {
  const query = {
    query: {
      terms: {
        type: types
      }
    },
    sort: Object.entries(sort).map(([key, value]) => ({[key]: value})),// elastic wants sorts as array og object with single keys
    size
  }

  return query
}
