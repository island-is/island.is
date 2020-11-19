import { DocumentByMetaDataInput } from '../types'
import { tagQuery } from './tagQuery'

// TODO: Make inclusivity optional
// TODO: Scope tags to single document
export const documentByMetaDataQuery = ({
  types = [],
  tags = [],
  sort = {},
  page = 1,
  size = 10,
  date,
}: DocumentByMetaDataInput) => {
  const must = []

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

  if (date) {
    must.push({
      range: {
        dateCreated: {
          gte: date.from,
          lte: date.to,
        },
      },
    })
  }

  const query = {
    query: {
      bool: {
        must,
      },
    },
    sort: Object.entries(sort).map(([key, value]) => ({ [key]: value })), // elastic wants sorts as array of object with single keys
    size,
    from: (page - 1) * size, // if we have a page number add it as offset for pagination
  }

  return query
}
