import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { UserDropdownItem } from './UserDropdownItem'
import { m } from '@island.is/service-portal/core'

export const UserProfileInfo = ({ onClick }: { onClick: () => void }) => {
  const { formatMessage } = useLocale()
  const isDev = process.env.NODE_ENV === 'development'
  const baseUrl = isDev
    ? 'http://localhost:4200/minarsidur/stillingar'
    : 'https://island.is/minarsidur/stillingar'
  return (
    <Box paddingY={3}>
      <Box marginBottom={1}>
        <Text variant="small">{formatMessage(m.settings)}</Text>
      </Box>

      <Box>
        <UserDropdownItem
          text={formatMessage(m.personalInformation)}
          link={`${baseUrl}/personuupplysingar`}
          icon={{ type: 'outline', icon: 'person' }}
          onClick={() => onClick()}
        />
      </Box>
      <Box>
        <UserDropdownItem
          text={formatMessage(m.accessControl)}
          link={`${baseUrl}/adgangsstyring`}
          icon={{ type: 'outline', icon: 'people' }}
          onClick={() => onClick()}
        />
      </Box>
      <Box>
        <UserDropdownItem
          text={'Íslenska - skipta um tungumál'}
          link={`${baseUrl}/adgangsstyring`}
          icon={{ type: 'outline', icon: 'people' }}
          onClick={() => onClick()}
        />
      </Box>
    </Box>
  )
}
