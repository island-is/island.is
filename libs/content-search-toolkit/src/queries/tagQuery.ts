import { elasticTagField } from '../types'

export type TagQuery = ReturnType<typeof tagQuery>

export const tagQuery = (tag: elasticTagField) => ({
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
})
