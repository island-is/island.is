import { useUserProfileActorProfileQuery } from '../components/NotificationSettings/ActorProfileNotificationSettings/userProfileActorProfile.query.generated'

export const useActorProfile = () => {
  const { data, loading, error, refetch } = useUserProfileActorProfileQuery()

  return { data: data?.userProfileActorProfile, loading, error, refetch }
}
