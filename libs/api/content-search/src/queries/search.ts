interface SearchInput {
  queryString: string
  size: number
  page: number
}

/*export interface AutocompleteTermResponse {
  suggest: {
    searchSuggester: [{ options: [{ text: string }] }]
  }
}*/

export interface SearchRequestBody {
  query: {
    query_string: {
      query: string,
      fields: string[],
      analyze_wildcard: boolean
    }
  },
  size: number
  from?: number
}

export const searchQuery = ({ queryString, size = 10, page = 0 }: SearchInput): SearchRequestBody => {
  const query = {
    query: {
      query_string: {
        query: `*${queryString}*`,
        fields: [
          'title.stemmed^10',
          'content.stemmed^2'
        ],
        analyze_wildcard: true
      }
    },
    size: size
  }

  if(page) {
    query['from'] = page - 1 * size
  }

  return query
}
