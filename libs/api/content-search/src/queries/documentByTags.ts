import { elasticTagField, sortableFields } from '../types'

export interface DocumentByTagInput {
  tag: elasticTagField
  sort?: sortableFields
  size?: number
}

export const documentByTagQuery = ({
  tag,
  sort = {},
  size = 10,
}: DocumentByTagInput) => ({
  query: {
    nested: {
      path: 'tags',
      query: {
        bool: {
          must: [
            {
              term: {
                'tags.key': tag.key,
              },
            },
            {
              term: {
                'tags.type': tag.type,
              },
            },
          ],
        },
      },
    },
  },
  size,
  sort: Object.entries(sort).map(([key, value]) => ({ [key]: value })), // elastic wants sorts as array og object with single keys
})
