import { useQuery } from '@apollo/client'
import { OfficialJournalOfIcelandApplicationGetMyUserInfoResponse } from '@island.is/api/schema'
import { MY_USER_INFO_QUERY } from '../graphql/queries'

type OJOIUserResponse = {
  officialJournalOfIcelandApplicationGetMyUserInfo: OfficialJournalOfIcelandApplicationGetMyUserInfoResponse
}

export const useOJOIUser = () => {
  const { data, loading, error } = useQuery<OJOIUserResponse>(
    MY_USER_INFO_QUERY,
    {
      fetchPolicy: 'no-cache',
    },
  )

  return {
    user: data?.officialJournalOfIcelandApplicationGetMyUserInfo,
    loading,
    error,
  }
}
