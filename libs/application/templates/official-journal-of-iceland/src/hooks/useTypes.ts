import { NetworkStatus, useQuery } from '@apollo/client'
import { OfficialJournalOfIcelandAdvertsTypesResponse } from '@island.is/api/schema'

import { TYPES_QUERY } from '../graphql/queries'

type UseTypesParams = {
  initalDepartmentId?: string
}

type TypesResponse = {
  officialJournalOfIcelandTypes: OfficialJournalOfIcelandAdvertsTypesResponse
}

type TypesVariables = {
  params: {
    department: string
    page?: number
    pageSize?: number
  }
}

export const useTypes = ({
  initalDepartmentId: departmentId,
}: UseTypesParams) => {
  const { data, loading, error, refetch, networkStatus } = useQuery<
    TypesResponse,
    TypesVariables
  >(TYPES_QUERY, {
    variables: {
      params: {
        department: departmentId ?? '',
        page: 1,
        pageSize: 1000,
      },
    },
    notifyOnNetworkStatusChange: true,
  })

  return {
    useLazyTypes: refetch,
    types: data?.officialJournalOfIcelandTypes.types,
    loading: loading || networkStatus === NetworkStatus.refetch,
    error,
  }
}
