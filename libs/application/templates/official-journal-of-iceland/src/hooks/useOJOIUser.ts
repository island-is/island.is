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

  console.log('data', data)

  return {
    user: data?.officialJournalOfIcelandApplicationGetMyUserInfo,
    loading,
    error,
  }
}
