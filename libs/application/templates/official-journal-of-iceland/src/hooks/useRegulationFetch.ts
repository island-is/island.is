import { useQuery } from '@apollo/client'
import { REGULATION_FROM_API_QUERY } from '../graphql/queries'
import type { Regulation } from '@island.is/regulations'

type RegulationFromApiResponse = {
  OJOIAGetRegulationFromApi: Regulation | null
}

type RegulationFromApiVariables = {
  input: {
    regulation: string
    date?: string
  }
}

export const useRegulationFetch = (name?: string, date?: string) => {
  const { data, loading, error } = useQuery<
    RegulationFromApiResponse,
    RegulationFromApiVariables
  >(REGULATION_FROM_API_QUERY, {
    variables: {
      input: {
        regulation: name ?? '',
        date,
      },
    },
    skip: !name,
    fetchPolicy: 'no-cache',
  })

  return {
    regulation: data?.OJOIAGetRegulationFromApi ?? undefined,
    loading,
    error,
  }
}
