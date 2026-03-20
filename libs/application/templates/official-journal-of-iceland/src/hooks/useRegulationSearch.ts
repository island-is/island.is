import { useLazyQuery } from '@apollo/client'
import { REGULATION_OPTION_SEARCH_QUERY } from '../graphql/queries'
import type { RegulationOptionList } from '@island.is/regulations'

type RegulationSearchResponse = {
  OJOIAGetRegulationsOptionSearch: {
    regulations: RegulationOptionList
  } | null
}

type RegulationSearchVariables = {
  input: {
    q?: string
    rn?: string
    ch?: string
    year?: number
    yearTo?: number
    iA?: boolean
    iR?: boolean
    page?: number
  }
}

export type RegulationSearchOption = {
  value: string
  label: string
  /** The regulation title without the name prefix */
  title: string
}

export const useRegulationSearch = () => {
  const [executeSearch, { data, loading, error }] = useLazyQuery<
    RegulationSearchResponse,
    RegulationSearchVariables
  >(REGULATION_OPTION_SEARCH_QUERY, {
    fetchPolicy: 'network-only',
  })

  const search = (query: string) => {
    if (!query || query.length < 2) {
      return
    }
    executeSearch({
      variables: {
        input: { q: query },
      },
    })
  }

  const results: RegulationSearchOption[] | undefined =
    data?.OJOIAGetRegulationsOptionSearch?.regulations?.map((item) => ({
      value: String(item.name),
      label: `${item.name} — ${item.title}`,
      title: String(item.title),
    }))

  return {
    search,
    results,
    loading,
    error,
  }
}
