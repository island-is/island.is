import { useQuery } from '@apollo/client'

import {
  OfficialJournalOfIcelandAdvert,
  OfficialJournalOfIcelandAdvertsResponse,
} from '@island.is/web/graphql/schema'

import { ADVERTS_QUERY } from '../../queries/OfficialJournalOfIceland'
import { getAdvertParams } from '../lib/advert-params.mapper'

export type UseAdvertsResponse = {
  officialJournalOfIcelandAdverts: OfficialJournalOfIcelandAdvertsResponse
}

export type UseAdvertsVariables = {
  search?: string
  page?: number
  pageSize?: number
  department?: Array<string>
  type?: Array<string>
  category?: Array<string>
  involvedParty?: Array<string>
  dateFrom?: string
  dateTo?: string
  year?: string
}

export type UseAdvertsInput = {
  input: UseAdvertsVariables
}

export type UseAdvertsParams = {
  vars?: UseAdvertsVariables
  fallbackData?: OfficialJournalOfIcelandAdvert[]
}

export const useAdverts = ({ vars, fallbackData }: UseAdvertsParams) => {
  const variables = getAdvertParams(vars)

  const { data, loading, error, refetch } = useQuery<
    UseAdvertsResponse,
    UseAdvertsInput
  >(ADVERTS_QUERY, {
    fetchPolicy: 'no-cache',
    nextFetchPolicy: 'no-cache',
    variables: { input: variables },
  })

  return {
    adverts: data?.officialJournalOfIcelandAdverts.adverts || fallbackData,
    paging: data?.officialJournalOfIcelandAdverts.paging,
    loading,
    error,
    refetch,
  }
}
