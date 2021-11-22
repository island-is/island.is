import { useQuery } from '@apollo/client'
import { IslykillSettings, Query, UserProfile } from '@island.is/api/schema'
import isEmpty from 'lodash/isEmpty'
import { USER_PRFOLIE_AND_ISLYKILL } from '../../lib/queries/getCombinedIslykillAndUserprofile'

export const useUserProfileAndIslykill = () => {
  const { data, loading, error } = useQuery<Query>(USER_PRFOLIE_AND_ISLYKILL, {
    fetchPolicy: 'no-cache',
  })

  const userProfile = data?.getUserProfile
  const islykillSettings = data?.getIslykillSettings
  const combinedData = {
    ...userProfile,
    ...islykillSettings,
  } as UserProfile & IslykillSettings
  return {
    data: isEmpty(combinedData) ? null : combinedData,
    loading,
    error,
  }
}
