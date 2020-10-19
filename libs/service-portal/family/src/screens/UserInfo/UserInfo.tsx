import React from 'react'
<<<<<<< HEAD
import {
  Typography,
  Box,
  Stack,
  ButtonDeprecated as Button,
  IconDeprecated as Icon,
  Hidden,
} from '@island.is/island-ui/core'
=======
import { Typography, Box, Stack, Icon, Hidden } from '@island.is/island-ui/core'
>>>>>>> d0b8e1dc0733438593aa212862cc485c1c7c189e
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import UserInfoLine from '../../components/UserInfoLine/UserInfoLine'
import * as styles from './UserInfo.treat'
import { useLocale } from '@island.is/localization'
import { defineMessage } from 'react-intl'
import { useUserProfile } from '@island.is/service-portal/graphql'

const SubjectInfo: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()
  const { data: userProfile } = useUserProfile(userInfo.profile.natreg)

  return (
    <>
      <Box marginBottom={6}>
        <Typography variant="h1" as="h1">
          {formatMessage({
            id: 'service.portal:my-info',
            defaultMessage: 'Mínar upplýsingar',
          })}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" marginBottom={4}>
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
        <Typography variant="h2">{userInfo.profile.name}</Typography>
      </Box>
      <Stack space={1}>
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:display-name',
            defaultMessage: 'Birtingarnafn',
          })}
          content={userInfo.profile.name}
          editExternalLink="https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/stok-vara/?productid=5c55d7a6-089b-11e6-943d-005056851dd2"
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:natreg',
            defaultMessage: 'Kennitala',
          })}
          content={userInfo.profile.natreg}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:citizenship',
            defaultMessage: 'Ríkisfang',
          })}
          content={
            userInfo.profile.nat === 'IS' ? 'Ísland' : userInfo.profile.nat
          }
        />
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
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:language',
            defaultMessage: 'Tungumál',
          })}
          content={userProfile?.locale || ''}
        />
      </Stack>
    </>
  )
}

export default SubjectInfo
