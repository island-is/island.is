import { useLazyQuery, useQuery } from '@apollo/client'
import { OfficialJournalOfIcelandMainTypesResponse } from '@island.is/api/schema'

import { MAIN_TYPES_QUERY } from '../graphql/queries'

type UseTypesParams = {
  initalDepartmentId?: string
  onCompleted?: (data: MainTypesResponse) => void
  pageSize?: number
  page?: number
}

type MainTypesResponse = {
  officialJournalOfIcelandMainTypes: OfficialJournalOfIcelandMainTypesResponse
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

  const { data, loading, error } = useQuery<MainTypesResponse, TypesVariables>(
    MAIN_TYPES_QUERY,
    {
      variables: {
        params: params,
      },
      onCompleted: onCompleted,
    },
  )

  const {
    data: mainTypesData,
    loading: mainTypeLoading,
    error: mainTypeError,
  } = useQuery<MainTypesResponse, TypesVariables>(MAIN_TYPES_QUERY, {
    variables: {
      params: params,
    },
  })

  const [
    getLazyMainTypes,
    {
      data: lazyMainTypes,
      loading: lazyMainTypesLoading,
      error: lazyMainTypesError,
    },
  ] = useLazyQuery<MainTypesResponse, TypesVariables>(MAIN_TYPES_QUERY, {
    fetchPolicy: 'network-only',
  })

  const currentMainTypes = lazyMainTypes
    ? lazyMainTypes.officialJournalOfIcelandMainTypes.mainTypes
    : mainTypesData?.officialJournalOfIcelandMainTypes.mainTypes

  return {
    mainTypes: currentMainTypes,
    mainTypeLoading,
    mainTypeError,
    lazyMainTypesLoading,
    lazyMainTypesError,
    getLazyMainTypes,
    lazyMainTypes: lazyMainTypes?.officialJournalOfIcelandMainTypes.mainTypes,
    initialTypes: data?.officialJournalOfIcelandMainTypes.mainTypes,
    loading: loading || lazyMainTypesLoading,
    error,
  }
}
