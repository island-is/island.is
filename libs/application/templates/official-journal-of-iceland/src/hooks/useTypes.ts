import { NetworkStatus, useQuery } from '@apollo/client'
import { OfficialJournalOfIcelandAdvertsTypesResponse } from '@island.is/api/schema'

import { TYPES_QUERY } from '../graphql/queries'

type UseTypesParams = {
  initalDepartmentId?: string
  onCompleted?: (data: TypesResponse) => void
  pageSize?: number
  page?: number
}

type TypesResponse = {
  officialJournalOfIcelandTypes: OfficialJournalOfIcelandAdvertsTypesResponse
}

type TypesVariables = {
  params: {
    department?: string
    page?: number
    pageSize?: number
  }
}

export const useTypes = ({
  initalDepartmentId: departmentId,
  onCompleted,
}: UseTypesParams) => {
  const params: TypesVariables['params'] = {}

  if (departmentId) {
    params.department = departmentId
  }

  if (!params.page) {
    params.page = 1
  }

  if (!params.pageSize) {
    params.pageSize = 1000
  }

  const { data, loading, error, refetch, networkStatus } = useQuery<
    TypesResponse,
    TypesVariables
  >(TYPES_QUERY, {
    variables: {
      params: params,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: onCompleted,
  })

  return {
    useLazyTypes: refetch,
    types: data?.officialJournalOfIcelandTypes.types,
    loading: loading || networkStatus === NetworkStatus.refetch,
    error,
  }
}
