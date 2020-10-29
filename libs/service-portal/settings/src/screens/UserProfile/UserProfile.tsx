import React from 'react'
import { Box, Icon, Stack, Tag, Text, Tooltip } from '@island.is/island-ui/core'
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
          content={
            userProfile?.email ? (
              <Box display="flex" alignItems="center">
                <span>{userProfile.email}</span>
                <Box marginLeft={2}>
                  {userProfile.emailVerified ? (
                    <Tag variant="darkerMint">
                      {formatMessage({
                        id: 'sp.settings:verified',
                        defaultMessage: 'Staðfest',
                      })}
                    </Tag>
                  ) : (
                    <Tag variant="red">
                      {formatMessage({
                        id: 'sp.settings:not-verified',
                        defaultMessage: 'Óstaðfest',
                      })}
                    </Tag>
                  )}
                </Box>
              </Box>
            ) : (
              ''
            )
          }
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
          content={
            userProfile?.mobilePhoneNumber ? (
              <Box display="flex" alignItems="center">
                <span>{userProfile.mobilePhoneNumber}</span>
                <Box marginLeft={2}>
                  {userProfile.mobilePhoneNumberVerified ? (
                    <Tag variant="darkerMint">
                      {formatMessage({
                        id: 'sp.settings:verified',
                        defaultMessage: 'Staðfest',
                      })}
                    </Tag>
                  ) : (
                    <Tag variant="red">
                      {formatMessage({
                        id: 'sp.settings:not-verified',
                        defaultMessage: 'Óstaðfest',
                      })}
                    </Tag>
                  )}
                </Box>
              </Box>
            ) : (
              ''
            )
          }
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
