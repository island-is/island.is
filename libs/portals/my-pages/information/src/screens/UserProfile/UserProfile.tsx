import { ActorProfileScope, UserProfileScope } from '@island.is/auth/scopes'
import { useLocale } from '@island.is/localization'
import {
  ISLANDIS_SLUG,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import { useUserProfile } from '@island.is/portals/my-pages/graphql'
import { useUserInfo } from '@island.is/react-spa/bff'
import ProfileForm from '../../components/PersonalInformation/Forms/ProfileForm/ProfileForm'
import { msg } from '../../lib/messages'
import { Box } from '@island.is/island-ui/core'
import { AccessDenied } from '@island.is/portals/core'

const UserProfile = () => {
  const { data } = useUserProfile()
  const { formatMessage } = useLocale()
  const { scopes, profile } = useUserInfo()

  const isActor = !!profile?.actor
  const hasUserProfileWriteScope = scopes.includes(UserProfileScope.write)

  if (!hasUserProfileWriteScope && !isActor) {
    return (
      <Box paddingY={1}>
        <AccessDenied />
      </Box>
    )
  }

  return (
    <>
      <IntroWrapper
        marginBottom={[4, 4, 6]}
        title={formatMessage(m.mySettings)}
        intro={formatMessage(msg.overlayIntro)}
        serviceProviderTooltip={formatMessage(m.userProfileTooltip)}
        serviceProviderSlug={ISLANDIS_SLUG}
      />
      <ProfileForm
        showIntroText={false}
        showDetails={!!data}
        title={profile.name || ''}
        isActor={isActor}
      />
    </>
  )
}

export default UserProfile
