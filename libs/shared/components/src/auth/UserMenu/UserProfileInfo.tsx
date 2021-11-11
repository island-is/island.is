import React from 'react'
import { Button, Box, Icon, Text } from '@island.is/island-ui/core'
import { useFeatureFlag } from '@island.is/feature-flags'
import { useLocale } from '@island.is/localization'
import { sharedMessages } from '@island.is/shared/translations'
import { useGetUserProfileQuery } from '../../../gen/graphql'
import * as styles from './UserMenu.css'

export const UserProfileInfo = () => {
  const { value: showPersonalInfo } = useFeatureFlag(
    'isServicePortalPersonalInformationModuleEnabled',
    false,
  )
  const { data } = useGetUserProfileQuery({ skip: !showPersonalInfo })
  const { formatMessage } = useLocale()
  if (showPersonalInfo) {
    const settings = data?.getUserProfile
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
        )}
      </>
    )
  }
  return null
}
