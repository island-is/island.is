import React from 'react'
import { Typography, Box, Stack, Icon, Hidden } from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import * as styles from './UserProfile.treat'
import { useLocale, useNamespaces } from '@island.is/localization'
import { defineMessage } from 'react-intl'
import { useUserProfile } from '@island.is/service-portal/graphql'
import { UserInfoLine } from '@island.is/service-portal/core'

const UserProfile: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  const { data: userProfile } = useUserProfile(userInfo.profile.natreg)

  return (
    <>
      <Box marginBottom={6}>
        <Typography variant="h1" as="h1">
          {formatMessage({
            id: 'service.portal:profile-info',
            defaultMessage: 'Minn aðgangur',
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
          editLink={{
            url: ServicePortalPath.UserProfileEditEmail,
            title: defineMessage({
              id: 'sp.settings:edit-email',
              defaultMessage: 'Breyta netfangi',
            }),
          }}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:tel',
            defaultMessage: 'Símanúmer',
          })}
          content={userProfile?.mobilePhoneNumber || ''}
          editLink={{
            url: ServicePortalPath.UserProfileEditPhoneNumber,
            title: defineMessage({
              id: 'sp.settings:edit-phone-number',
              defaultMessage: 'Breyta símanúmeri',
            }),
          }}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:language',
            defaultMessage: 'Tungumál',
          })}
          content={
            userProfile
              ? userProfile.locale === 'is'
                ? 'Íslenska'
                : 'English'
              : ''
          }
          editLink={{
            url: ServicePortalPath.UserProfileEditLanguage,
            title: defineMessage({
              id: 'sp.settings:edit-language',
              defaultMessage: 'Breyta tungumáli',
            }),
          }}
        />
      </Stack>
    </>
  )
}

export default UserProfile
