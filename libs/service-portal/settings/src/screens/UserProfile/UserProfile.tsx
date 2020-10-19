import React from 'react'
import { Typography, Box, Stack, Icon, Hidden } from '@island.is/island-ui/core'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import * as styles from './UserProfile.treat'
import { useLocale } from '@island.is/localization'
import { defineMessage } from 'react-intl'
import { useUserProfile } from '@island.is/service-portal/graphql'
import UserInfoLine from 'libs/service-portal/core/src/components/UserInfoLine/UserInfoLine'

const UserProfile: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()
  const { data: userProfile } = useUserProfile(userInfo.profile.natreg)

  return (
    <>
      <Box marginBottom={6}>
        <Typography variant="h1" as="h1">
          {formatMessage({
            id: 'sp.settings:user-profile-title',
            defaultMessage: 'Prófíl upplýsingar',
          })}
        </Typography>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="spaceBetween"
        paddingY={4}
        paddingX={6}
        marginBottom={4}
        border="standard"
      >
        <Typography variant="h2">{userInfo.profile.name}</Typography>
        <Hidden below="sm">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginRight={5}
            borderRadius="circle"
            background="purple200"
            className={styles.avatar}
          >
            <Icon type="outline" icon="person" color="purple400" size="large" />
          </Box>
        </Hidden>
      </Box>
      <Stack space={1}>
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:email',
            defaultMessage: 'Netfang',
          })}
          content={userProfile?.email || ''}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:tel',
            defaultMessage: 'Símanúmer',
          })}
          content={userProfile?.mobilePhoneNumber || ''}
        />
      </Stack>
    </>
  )
}

export default UserProfile
