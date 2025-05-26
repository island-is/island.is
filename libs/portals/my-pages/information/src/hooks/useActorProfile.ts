import { useUserProfileActorProfileQuery } from '../components/notificationSettings/ActorProfileNotificationSettings/userProfileActorProfile.query.generated'

export const useActorProfile = () => {
  const { data, loading, error, refetch } = useUserProfileActorProfileQuery()

  return { data: data?.userProfileActorProfile, loading, error, refetch }
}
