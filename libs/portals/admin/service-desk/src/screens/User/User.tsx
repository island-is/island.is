import format from 'date-fns/format'
import { useLoaderData, useNavigate } from 'react-router-dom'

import { ActionCard, Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { BackButton } from '@island.is/portals/admin/core'
import { IntroHeader, formatNationalId } from '@island.is/portals/core'
import { dateFormat } from '@island.is/shared/constants'

import { ServiceDeskPaths } from '../../lib/paths'
import { UserProfileResult } from './User.loader'
import { m } from '../../lib/messages'

const User = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const user = useLoaderData() as UserProfileResult
  const formattedNationalId = formatNationalId(user.nationalId)

  return (
    <Stack space={'containerGutter'}>
      <BackButton onClick={() => navigate(ServiceDeskPaths.Users)} />
      <div>
        <div>
          <IntroHeader
            title={user.fullName ?? formattedNationalId}
            intro={formattedNationalId}
          />
        </div>
        <Box display="flex" width="full" columnGap="smallGutter">
          <Box
            display="flex"
            flexDirection="column"
            rowGap="smallGutter"
            columnGap="gutter"
            width="full"
          >
            {[
              {
                textKey: m.documentNotification,
                value: user.documentNotifications ? m.yes : m.no,
              },
              {
                textKey: m.emailNotification,
                value: user.emailNotifications ? m.yes : m.no,
              },
              {
                textKey: m.language,
                value: user.locale === 'en' ? m.english : m.icelandic,
              },
            ].map(({ textKey, value }) => (
              <Box display="flex" columnGap="smallGutter" key={textKey.id}>
                <Text fontWeight="medium">{formatMessage(textKey)}: </Text>
                <Text>{formatMessage(value)}</Text>
              </Box>
            ))}
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            width="full"
            rowGap="smallGutter"
            columnGap="smallGutter"
          >
            {[
              {
                textKey: m.lastNudge,
                value: user.lastNudge,
              },
              {
                textKey: m.nextNudge,
                value: user.nextNudge,
              },
            ].map(({ textKey, value }) => (
              <Box display="flex" columnGap="smallGutter" key={textKey.id}>
                <Text fontWeight="medium">{formatMessage(textKey)}: </Text>
                <Text>{format(new Date(value as string), dateFormat.is)}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      </div>
      <Stack space="gutter">
        <Text variant="h4">{formatMessage(m.info)}</Text>
        <Box
          rowGap="gutter"
          columnGap="gutter"
          display="flex"
          flexDirection={['column', 'row', 'row']}
          width="full"
        >
          <Box width="full">
            <ActionCard
              heading={formatMessage(m.email)}
              text={user.email ?? ''}
              unavailable={{
                active: true,
                label: formatMessage(
                  user.emailVerified ? m.verified : m.unverified,
                ),
                message: formatMessage(
                  user.emailVerified ? m.verifiedTooltip : m.unverifiedTooltip,
                ),
              }}
            />
          </Box>
          <Box width="full">
            <ActionCard
              heading={formatMessage(m.phone)}
              text={user.mobilePhoneNumber ?? ''}
              unavailable={{
                active: true,
                label: formatMessage(
                  user.mobilePhoneNumberVerified ? m.verified : m.unverified,
                ),
                message: formatMessage(
                  user.mobilePhoneNumberVerified
                    ? m.verifiedTooltip
                    : m.unverifiedTooltip,
                ),
              }}
            />
          </Box>
        </Box>
      </Stack>
    </Stack>
  )
}

export default User
