import React, { useState } from 'react'
import { Box, Stack, Text, SkeletonLoader } from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { UserInfoLine, m } from '@island.is/service-portal/core'
import { FamilyMemberCard } from '@island.is/service-portal/family'
import { useUserProfileAndIslykill } from '@island.is/service-portal/graphql'
import CreateWithEmail from '../../components/UserOnboardingModal/Islykill/CreateWithEmail'

const UserProfile: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()

  const { data: settings, loading } = useUserProfileAndIslykill()

  return (
    <>
      <Box marginBottom={5}>
        <Text variant="h1" as="h1">
          {formatMessage(m.personalInformation)}
        </Text>
      </Box>
      <Box marginBottom={[2, 3]}>
        <FamilyMemberCard title={userInfo.profile.name || ''} />
      </Box>
      {loading && <SkeletonLoader width="100%" height={100} />}
      {!loading && (
        <Stack space={1}>
          {settings && settings.noUserFound ? (
            <CreateWithEmail />
          ) : (
            <>
              <UserInfoLine
                label={m.email}
                labelColumnSpan={['8/12', '3/12']}
                editColumnSpan={['1/1', '2/12']}
                valueColumnSpan={['1/1', '7/12']}
                content={settings?.email ?? ''}
                editLink={{
                  url: ServicePortalPath.SettingsPersonalInformationEditEmail,
                }}
              />
              <UserInfoLine
                label={m.telNumber}
                labelColumnSpan={['8/12', '3/12']}
                editColumnSpan={['1/1', '2/12']}
                valueColumnSpan={['1/1', '7/12']}
                content={settings?.mobile ?? ''}
                editLink={{
                  url:
                    ServicePortalPath.SettingsPersonalInformationEditPhoneNumber,
                }}
              />
              <UserInfoLine
                label={m.language}
                content={
                  settings
                    ? settings.locale === 'is'
                      ? 'Íslenska'
                      : settings.locale === 'en'
                      ? 'English'
                      : ''
                    : ''
                }
                labelColumnSpan={['8/12', '3/12']}
                editColumnSpan={['1/1', '2/12']}
                valueColumnSpan={['1/1', '7/12']}
                editLink={{
                  url:
                    ServicePortalPath.SettingsPersonalInformationEditLanguage,
                }}
              />
            </>
          )}
        </Stack>
      )}
    </>
  )
}

export default UserProfile
