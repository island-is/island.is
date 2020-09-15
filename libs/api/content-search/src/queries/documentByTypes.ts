import { sortableFields } from '../types'

export interface DocumentByTypesInput {
  types: string[]
  sort?: sortableFields
  size?: number
}

export interface DocumentByTypesRequestBody {
  query: {
    terms: {
      type: string[]
    }
  }
  sort: sortableFields[]
  size: number
}

export const documentByTypeQuery = ({
  types,
  sort = {},
  size = 10,
}: DocumentByTypesInput): DocumentByTypesRequestBody => {
  const query = {
    query: {
      terms: {
        type: types,
      },
    },
    sort: Object.entries(sort).map(([key, value]) => ({ [key]: value })), // elastic wants sorts as array og object with single keys
    size,
  }

  return query
}
