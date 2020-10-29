import { useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { NATIONAL_REGISTRY_INFO } from '../../lib/queries/getNationaRegistryUserInfo'

export const useNationalRegistryInfo = () => {
  const { data, loading, error } = useQuery<Query>(NATIONAL_REGISTRY_INFO)

  return {
    data: data?.getMyInfo || null,
    loading,
    error,
  }
}
