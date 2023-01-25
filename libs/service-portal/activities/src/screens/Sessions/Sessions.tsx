import { useAuth } from '@island.is/auth/react'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'

import { m } from '../../lib/messages'

const Sessions = () => {
  const { formatMessage } = useLocale()
  const { userInfo } = useAuth()

  return (
    <>
      <IntroHeader
        title={formatMessage(m.sessions)}
        intro={formatMessage(m.sessionsHeaderIntro)}
      />
      <Box>
        <Text>{ userInfo?.profile?.actor?.name ?? userInfo?.profile?.name}</Text>
      </Box>
    </>
  )
}

export default Sessions
