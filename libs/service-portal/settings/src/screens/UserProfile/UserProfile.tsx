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

const UserProfile: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  const { data: userProfile } = useUserProfile()

  return (
    <>
      <Box marginBottom={5}>
        <Text variant="h1" as="h1">
          {formatMessage({
            id: 'service.portal:settings',
            defaultMessage: 'Stillingar',
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
          labelColumnSpan={['8/12', '3/12']}
          editColumnSpan={['1/1', '2/12']}
          valueColumnSpan={['1/1', '7/12']}
          renderContent={() => (
            <Box display="flex" alignItems="center">
              <Box marginRight={2}>{userProfile?.email || ''}</Box>
              {userProfile?.email && userProfile?.emailVerified === true ? (
                <Tag variant="blueberry" outlined disabled>
                  {formatMessage({
                    id: 'sp.settings:verified',
                    defaultMessage: 'Staðfest',
                  })}
                </Tag>
              ) : userProfile?.email && userProfile?.emailVerified === false ? (
                <Tag variant="red" disabled>
                  {formatMessage({
                    id: 'sp.settings:not-verified',
                    defaultMessage: 'Óstaðfest',
                  })}
                </Tag>
              ) : (
                <div />
              )}
            </Box>
          )}
          editLink={{
            url: ServicePortalPath.UserProfileEditEmail,
          }}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:tel',
            defaultMessage: 'Símanúmer',
          })}
          renderContent={() => (
            <Box display="flex" alignItems="center">
              <Box marginRight={2}>{userProfile?.mobilePhoneNumber || ''}</Box>
              {userProfile?.mobilePhoneNumber &&
              userProfile?.mobilePhoneNumberVerified === true ? (
                <Tag variant="blueberry" outlined disabled>
                  {formatMessage({
                    id: 'sp.settings:verified',
                    defaultMessage: 'Staðfest',
                  })}
                </Tag>
              ) : userProfile?.mobilePhoneNumber &&
                userProfile?.mobilePhoneNumberVerified === false ? (
                <Tag variant="red" disabled>
                  {formatMessage({
                    id: 'sp.settings:not-verified',
                    defaultMessage: 'Óstaðfest',
                  })}
                </Tag>
              ) : (
                <div />
              )}
            </Box>
          )}
          labelColumnSpan={['8/12', '3/12']}
          editColumnSpan={['1/1', '2/12']}
          valueColumnSpan={['1/1', '7/12']}
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
                : userProfile.locale === 'en'
                ? 'English'
                : ''
              : ''
          }
          labelColumnSpan={['8/12', '3/12']}
          editColumnSpan={['1/1', '2/12']}
          valueColumnSpan={['1/1', '7/12']}
          editLink={{
            url: ServicePortalPath.UserProfileEditLanguage,
          }}
        />
      </Stack>
    </>
  )
}

export default UserProfile
