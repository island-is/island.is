import { useLazyQuery, useQuery } from '@apollo/client'
import {
  OfficialJournalOfIcelandAdvertsTypesResponse,
  OfficialJournalOfIcelandMainTypesResponse,
} from '@island.is/api/schema'

import { MAIN_TYPES_QUERY, TYPES_QUERY } from '../graphql/queries'

type UseTypesParams = {
  initalDepartmentId?: string
  onCompleted?: (data: TypesResponse) => void
  pageSize?: number
  page?: number
}

type TypesResponse = {
  officialJournalOfIcelandTypes: OfficialJournalOfIcelandAdvertsTypesResponse
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

  const { data, loading, error } = useQuery<TypesResponse, TypesVariables>(
    TYPES_QUERY,
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
    getLazyTypes,
    { data: lazyTypes, loading: lazyTypesLoading, error: lazyTypesError },
  ] = useLazyQuery<TypesResponse, TypesVariables>(TYPES_QUERY, {
    fetchPolicy: 'network-only',
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

  const currentTypes = lazyTypes
    ? lazyTypes.officialJournalOfIcelandTypes.types
    : data?.officialJournalOfIcelandTypes.types

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
    lazyTypes: lazyTypes?.officialJournalOfIcelandTypes.types,
    lazyTypesLoading,
    lazyTypesError,
    getLazyTypes,
    types: currentTypes,
    initalTypes: data?.officialJournalOfIcelandTypes.types,
    loading: loading || lazyTypesLoading,
    error,
  }
}
