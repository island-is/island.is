import { Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { ServiceDeskPaths } from '../../lib/paths'
import { BackButton } from '@island.is/portals/admin/core'
import { IntroHeader, formatNationalId } from '@island.is/portals/core'
import { UserProfileResult } from './User.loader'

const User = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const user = useLoaderData() as UserProfileResult
  const formattedNationalId = formatNationalId(user.nationalId)

  return (
    <Stack space={'containerGutter'}>
      <BackButton onClick={() => navigate(ServiceDeskPaths.Users)} />
      <div>
        <IntroHeader
          title={user.fullName ?? formattedNationalId}
          intro={formattedNationalId}
        />
      </div>
      <div>
        <Text>Next nudge: {user.nextNudge}</Text>
      </div>
      <div>
        <Text>Last nudge: {user.lastNudge}</Text>
      </div>
    </Stack>
  )
}

export default User
