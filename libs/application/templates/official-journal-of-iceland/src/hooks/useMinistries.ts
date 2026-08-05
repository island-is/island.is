import { useQuery } from '@apollo/client'
import { MINISTRIES_QUERY } from '../graphql/queries'
import type { MinistryList } from '@island.is/regulations'

type MinistriesResponse = {
  OJOIAGetMinistries: {
    ministries: MinistryList
  } | null
}

export const useMinistries = () => {
  const { data, loading, error } =
    useQuery<MinistriesResponse>(MINISTRIES_QUERY)

  return {
    ministries: data?.OJOIAGetMinistries?.ministries ?? [],
    loading,
    error,
  }
}
