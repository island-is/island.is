import { elasticTagField } from '../types'

export type FilterQuery = ReturnType<typeof filterQuery>

export const filterQuery = (tag: elasticTagField) => ({
  filtered: {
    filter: {
      terms: {
        'tags.key': tag.key,
        'tags.type': tag.type,
      },
    },
  },
})
