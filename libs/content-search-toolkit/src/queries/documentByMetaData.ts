import { DocumentByMetaDataInput } from '../types'
import { tagQuery } from './tagQuery'

// TODO: Make inclusivity optional
// TODO: Scope tags to single document
export const documentByMetaDataQuery = ({
  types = [],
  tags = [],
  sort = [],
  page = 1,
  size = 10,
  date,
  releaseDate,
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

  if (releaseDate) {
    must.push({
      range: {
        releaseDate: {
          gte: releaseDate.from,
          lte: releaseDate.to,
        },
      },
    })
  }

  return {
    query: {
      bool: {
        must,
      },
    },
    sort,
    size,
    from: (page - 1) * size, // if we have a page number add it as offset for pagination
  }
}
