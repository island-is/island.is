import { useQuery } from '@apollo/client'
import { Query, QueryGetMyInfoArgs } from '@island.is/api/schema'
import { NATIONAL_REGISTRY_FAMILY_INFO } from '../../lib/queries/getNationalRegistryFamilyInfo'

export const useNationalRegistryFamilyInfo = (natReg: string) => {
  const { data, loading, error } = useQuery<Query, QueryGetMyInfoArgs>(
    NATIONAL_REGISTRY_FAMILY_INFO,
    {
      variables: {
        input: {
          nationalId: natReg,
        },
      },
    },
  )

  return {
    data: data?.getMyFamily || null,
    loading,
    error,
  }
}
