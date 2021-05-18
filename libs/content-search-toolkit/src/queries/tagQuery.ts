import { elasticTagField } from '../types'

export type TagQuery = ReturnType<typeof tagQuery>

export const tagQuery = (tag: elasticTagField) => ({
  nested: {
    path: 'tags',
    query: {
      bool: {
        must: [
          {
            term: tag.key
              ? {
                  'tags.key': tag.key,
                }
              : {
                  'tags.value': tag.value,
                },
          },
        ],
      },
    },
  },
})
