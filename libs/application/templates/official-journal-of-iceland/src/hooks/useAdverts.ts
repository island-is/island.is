import { useQuery } from '@apollo/client'
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE } from '../lib/constants'
import { ADVERTS_QUERY } from '../graphql/queries'
import { OfficialJournalOfIcelandAdvertsFullResponse } from '@island.is/api/schema'

/**
 * Fetches adverts from the API
 * @param page - The page number
 * @param pageSize - The number of items per page
 * @param search - The search query
 * @param department - The slug of the deparments to filter by
 * @param type - The slug of the types to filter by
 * @param category - The slug of the categories to filter by
 * @param involvedParty - The slug of the involved parties to filter by
 * @param dateFrom - The date to filter from
 * @param dateTo - The date to filter to
 */
type Props = {
  search?: string
  page?: number
  pageSize?: number
  department?: string[]
  type?: string[]
  category?: string[]
  involvedParty?: string[]
  dateFrom?: Date
  dateTo?: Date
}

type AdvertsResponse = {
  officialJournalOfIcelandAdverts: OfficialJournalOfIcelandAdvertsFullResponse
}

export const useAdverts = ({
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
  search,
  department,
  type,
  category,
  involvedParty,
  dateFrom,
  dateTo,
}: Props) => {
  const { data, loading, error } = useQuery<AdvertsResponse>(ADVERTS_QUERY, {
    variables: {
      input: {
        page,
        search,
        pageSize,
        department,
        type,
        category,
        involvedParty,
        dateFrom,
        dateTo,
      },
    },
  })

  return {
    adverts: data?.officialJournalOfIcelandAdverts.adverts,
    paging: data?.officialJournalOfIcelandAdverts.paging,
    loading,
    error,
  }
}
