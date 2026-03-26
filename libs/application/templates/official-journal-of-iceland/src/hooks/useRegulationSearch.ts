import { useLazyQuery } from '@apollo/client'
import { REGULATION_OPTION_SEARCH_QUERY } from '../graphql/queries'
import {
  prettyName,
  type RegulationOptionList,
  type RegName,
} from '@island.is/regulations'

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
  disabled?: boolean
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
        input: { q: query, iA: false, iR: false },
      },
    })
  }

  const results: RegulationSearchOption[] | undefined =
    data?.OJOIAGetRegulationsOptionSearch?.regulations?.map((item) => {
      const name = prettyName(item.name as RegName)
      if (item.repealed) {
        return {
          value: String(item.name),
          label: `${name} – ${item.title} (brottfallin)`,
          title: String(item.title),
          disabled: true,
        }
      }
      return {
        value: String(item.name),
        label: `${name} — ${item.title}`,
        title: String(item.title),
      }
    })

  return {
    search,
    results,
    loading,
    error,
  }
}
