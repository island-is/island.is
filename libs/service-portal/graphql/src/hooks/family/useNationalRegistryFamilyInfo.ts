import { useQuery } from '@apollo/client'
import { Document, Query, QueryGetMyInfoArgs } from '@island.is/api/schema'
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

  const mockData: Document[] = [
    {
      date: new Date(),
      id: '111',
      opened: false,
      senderName: 'Stafrænt Ísland',
      senderNatReg: '',
      subject: 'Rafræn skjöl frá Ísland.is',
    },
  ]

  return {
    data: data?.getMyFamily || null,
    loading,
    error,
  }
}
