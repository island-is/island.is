import React from 'react'
import { Button, Box, Icon, Text } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import { useFeatureFlag } from '@island.is/feature-flags'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { useIslykillSettings } from '@island.is/service-portal/graphql'
import { useLocale } from '@island.is/localization'
import { sharedMessages } from '@island.is/shared/translations'
import * as styles from './UserMenu.css'

interface UserProfileInfoProps {
  onClose: () => void
}

export const UserProfileInfo = ({ onClose }: UserProfileInfoProps) => {
  const { data: settings } = useIslykillSettings()
  const { formatMessage } = useLocale()
  const { value: showPersonalInfo } = useFeatureFlag(
    'isServicePortalPersonalInformationModuleEnabled',
    false,
  )
  if (showPersonalInfo) {
    return (
      <>
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
        {settings?.mobile && (
          <Box
            display="flex"
            alignItems="center"
            marginBottom={2}
            className={styles.breakWord}
          >
            <Box display="flex" alignItems="center" marginRight={2}>
              <Icon type="outline" icon="call" color="blue300" />
            </Box>
            <Text>{settings?.mobile}</Text>
          </Box>
        )}
        {(settings?.email || settings?.mobile) && (
          <Link to={ServicePortalPath.SettingsRoot} onClick={onClose}>
            <Button variant="text" icon="arrowForward" size="small">
              {formatMessage(sharedMessages.edit)}
            </Button>
          </Link>
        )}
      </>
    )
  }
  return null
}
