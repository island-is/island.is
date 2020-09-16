import { logger } from '@island.is/logging'
import { sortableFields } from '../types'

export interface DocumentByTypesInput {
  types: string[]
  sort?: sortableFields
  size?: number
}

export const documentByTypeQuery = ({
  types,
  sort = {},
  size = 10,
}: DocumentByTypesInput) => ({
  query: {
    bool: {
      must: [
        {
          terms: {
            type: types,
          },
        },
      ],
    },
  },
  sort: Object.entries(sort).map(([key, value]) => ({ [key]: value })), // elastic wants sorts as array og object with single keys
  size,
})
