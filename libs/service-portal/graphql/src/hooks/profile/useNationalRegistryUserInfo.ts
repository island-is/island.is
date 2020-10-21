import { useQuery } from '@apollo/client'
import { Document, Query, QueryGetMyInfoArgs } from '@island.is/api/schema'
import { NATIONAL_REGISTRY_INFO } from '../../lib/queries/getNationaRegistryUserInfo'

export const useNationalRegistryInfo = (natReg: string) => {
  const { data, loading, error } = useQuery<Query, QueryGetMyInfoArgs>(
    NATIONAL_REGISTRY_INFO,
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
    data: data?.getMyInfo || null,
    loading,
    error,
  }
}
