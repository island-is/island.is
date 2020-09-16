import { logger } from '@island.is/logging'
import { elasticTagField, sortableFields } from '../types'

interface TagsBase {
  types?: string[]
  tags?: elasticTagField[]
  sort?: sortableFields
  size?: number
}

interface RequiredTypes extends TagsBase {
  types: string[]
}

interface RequiredTags extends TagsBase {
  tags: elasticTagField[]
}

export type DocumentByMetaDataInput = RequiredTypes | RequiredTags

const tagQuery = (tag) => ({
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

// TODO: Make inclusivity optional
// TODO: Scope tags to single document
export const documentByMetaDataQuery = ({
  types = [],
  tags = [],
  sort = {},
  size = 10,
}: DocumentByMetaDataInput) => {
  const must = []

  // add types to query
  if (types.length) {
    must.push({
      terms: {
        type: types,
      },
    })
  }

  if (tags.length) {
    tags.forEach((tag) => {
      must.push(tagQuery(tag))
    })
  }

  const query = {
    query: {
      bool: {
        must,
      },
    },
    sort: Object.entries(sort).map(([key, value]) => ({ [key]: value })), // elastic wants sorts as array og object with single keys
    size,
  }

  return query
}
