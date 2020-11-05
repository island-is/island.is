import { useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { NATIONAL_REGISTRY_FAMILY_INFO } from '../../lib/queries/getNationalRegistryFamilyInfo'

export const useNationalRegistryFamilyInfo = () => {
  const { data, loading, error, called } = useQuery<Query>(
    NATIONAL_REGISTRY_FAMILY_INFO,
  )

  return {
    data: data?.getMyFamily || null,
    loading,
    error,
    called,
  }
}
