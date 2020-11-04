import React from 'react'
import { Box, Stack, Tag, Text } from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { defineMessage } from 'react-intl'
import { useUserProfile } from '@island.is/service-portal/graphql'
import { UserInfoLine } from '@island.is/service-portal/core'
import { FamilyMemberCard } from '@island.is/service-portal/family'
import { Link } from 'react-router-dom'

const UserProfile: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  const { data: userProfile } = useUserProfile()

  return (
    <>
      <Box marginBottom={6}>
        <Text variant="h1" as="h1">
          {formatMessage({
            id: 'service.portal:profile-info',
            defaultMessage: 'Minn aðgangur',
          })}
        </Text>
      </Box>
      <Box marginBottom={[2, 3]}>
        <FamilyMemberCard title={userInfo.profile.name || ''} />
      </Box>
      <Stack space={1}>
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:email',
            defaultMessage: 'Netfang',
          })}
          content={userProfile?.email || ''}
          tag={
            userProfile?.emailVerified ? (
              <Tag variant="darkerMint">
                {formatMessage({
                  id: 'sp.settings:verified',
                  defaultMessage: 'Staðfest',
                })}
              </Tag>
            ) : (
              <Link to={ServicePortalPath.UserProfileEditPhoneNumber}>
                <Tag variant="red">
                  {formatMessage({
                    id: 'sp.settings:not-verified',
                    defaultMessage: 'Óstaðfest',
                  })}
                </Tag>
              </Link>
            )
          }
          editLink={{
            url: ServicePortalPath.UserProfileEditEmail,
          }}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:tel',
            defaultMessage: 'Símanúmer',
          })}
          content={userProfile?.mobilePhoneNumber || ''}
          tag={
            userProfile?.mobilePhoneNumberVerified ? (
              <Tag variant="darkerMint">
                {formatMessage({
                  id: 'sp.settings:verified',
                  defaultMessage: 'Staðfest',
                })}
              </Tag>
            ) : (
              <Link to={ServicePortalPath.UserProfileEditPhoneNumber}>
                <Tag variant="red">
                  {formatMessage({
                    id: 'sp.settings:not-verified',
                    defaultMessage: 'Óstaðfest',
                  })}
                </Tag>
              </Link>
            )
          }
          editLink={{
            url: ServicePortalPath.UserProfileEditPhoneNumber,
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
          }}
        />
      </Stack>
    </>
  )
}

export default UserProfile
