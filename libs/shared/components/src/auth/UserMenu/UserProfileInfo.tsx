import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { UserDropdownItem } from './UserDropdownItem'
import { ServicePortalPath, m } from '@island.is/service-portal/core'

export const UserProfileInfo = ({ onClick }: { onClick: () => void }) => {
  const { formatMessage } = useLocale()

  return (
    <>
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
      {/* 
        {settings?.email && (
          <Box
            display="flex"
            alignItems="center"
            marginBottom={1}
            className={styles.breakWord}
          >
            <Box display="flex" alignItems="center" marginRight={2}>
              <Icon type="outline" icon="mail" color="blue300" />
            </Box>
            <Text>{settings.email}</Text>
          </Box>
        )}
        {settings?.mobilePhoneNumber && (
          <Box
            display="flex"
            alignItems="center"
            marginBottom={2}
            className={styles.breakWord}
          >
            <Box display="flex" alignItems="center" marginRight={2}>
              <Icon type="outline" icon="call" color="blue300" />
            </Box>
            <Text>{settings?.mobilePhoneNumber}</Text>
          </Box>
        )}
        {(settings?.email || settings?.mobilePhoneNumber) && (
          <a href="/minarsidur/stillingar/personuupplysingar">
            <Button variant="text" icon="arrowForward" size="small">
              {formatMessage(sharedMessages.edit)}
            </Button>
          </a>
        )} */}
    </>
  )
}
