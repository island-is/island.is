import { elasticTagField, sortableFields } from '../types'

export interface DocumentByTagInput {
  tag: elasticTagField
  sort?: sortableFields
  size?: number
}

type tagFields =
  | {
      term: {
        'tags.key': string
      }
    }
  | {
      term: {
        'tags.type': string
      }
    }

export interface DocumentByTagRequestBody {
  query: {
    nested: {
      path: string
      query: {
        bool: {
          must: tagFields[]
        }
      }
    }
  }
  sort: sortableFields[]
  size: number
}

export const documentByTagQuery = ({
  tag,
  sort = {},
  size = 10,
}: DocumentByTagInput): DocumentByTagRequestBody => {
  const query = {
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
  }
  return query
}
