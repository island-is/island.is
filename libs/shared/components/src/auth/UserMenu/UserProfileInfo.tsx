import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { UserDropdownItem } from './UserDropdownItem'
import { ServicePortalPath, m } from '@island.is/service-portal/core'

export const UserProfileInfo = ({ onClick }: { onClick: () => void }) => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box marginBottom={1}>
        <Text variant="small">{formatMessage(m.settings)}</Text>
      </Box>

      <Box>
        <UserDropdownItem
          text={formatMessage(m.personalInformation)}
          link={ServicePortalPath.SettingsPersonalInformation}
          icon={{ type: 'outline', icon: 'person' }}
          onClick={() => onClick()}
        />
      </Box>
      <Box paddingTop={1}>
        <UserDropdownItem
          text={formatMessage(m.accessControl)}
          link={ServicePortalPath.SettingsAccessControl}
          icon={{ type: 'outline', icon: 'people' }}
          onClick={() => onClick()}
        />
      </Box>
    </Box>
  )
}
