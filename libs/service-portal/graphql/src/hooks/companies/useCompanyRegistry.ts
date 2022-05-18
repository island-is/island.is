import { DocumentNode, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'

export const useCompanyRegistry = ({
  nationalId,
  query,
}: {
  nationalId: string
  query: DocumentNode
}) => {
  const { data, loading, error } = useQuery<Query>(query, {
    variables: { input: { nationalId } },
  })

  return {
    data: data?.companyRegistryCompany,
    loading,
    error,
  }
}
