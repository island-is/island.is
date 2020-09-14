interface SearchInput {
  queryString: string
  size: number
  page: number
  types: string[]
}

export interface SearchRequestBody {
  query: {
    bool: {
      should: any[], // Type this?
      must: any[] // Type this?
    }
  },
  size: number
  from: number
}

export const searchQuery = ({ queryString, size = 10, page = 1, types }: SearchInput): SearchRequestBody => {
  const should = []
  const must = []
  should.push({
    query_string: {
      query: `*${queryString}*`,
      fields: [
        'title.stemmed^10',
        'content.stemmed^2'
      ],
      analyze_wildcard: true
    }
  })

  // if we have types restrict the query to those types
  if(types?.length) {
    must.push({
      "terms": {
        "type": types
      }
    })
  }

  const query = {
    query: {
      bool: {
        should,
        must
      }
    },
    size,
    from: (page - 1) * size // if we have a page number add it as offset for pagination
  }

  return query
}
