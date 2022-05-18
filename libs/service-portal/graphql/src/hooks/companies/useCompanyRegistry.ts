import { useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { COMPANY_REGISTRY_INFORMATION } from '../../lib/queries/getCompanyRegistryCompany'

export const useCompanyRegistry = (nationalId: string) => {
  const { data, loading, error } = useQuery<Query>(
    COMPANY_REGISTRY_INFORMATION,
    {
      variables: { input: { nationalId } },
    },
  )

  return {
    data: data?.companyRegistryCompany,
    loading,
    error,
  }
}
