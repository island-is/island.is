import { useLocale } from '@island.is/localization'
import {
  ISLANDIS_SLUG,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import ProfileForm from '../../components/PersonalInformation/Forms/ProfileForm/ProfileForm'
import { msg } from '../../lib/messages'

const UserProfile = () => {
  const { formatMessage } = useLocale()
  const { profile } = useUserInfo()

  return (
    <>
      <IntroWrapper
        marginBottom={[4, 4, 6]}
        title={formatMessage(m.mySettings)}
        intro={formatMessage(msg.overlayIntro)}
        serviceProviderTooltip={formatMessage(m.userProfileTooltip)}
        serviceProviderSlug={ISLANDIS_SLUG}
      />
      <ProfileForm showIntroText={false} title={profile.name || ''} />
    </>
  )
}

export default UserProfile
