import format from 'date-fns/format'
import { useLoaderData, useNavigate, useRevalidator } from 'react-router-dom'

import { ActionCard, Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { BackButton } from '@island.is/portals/admin/core'
import { IntroHeader, formatNationalId } from '@island.is/portals/core'
import { dateFormat } from '@island.is/shared/constants'

import { ServiceDeskPaths } from '../../lib/paths'
import { UserProfileResult } from './User.loader'
import { m } from '../../lib/messages'
import { useUpdateUserProfileMutation } from './User.generated'
import { UpdateUserProfileInput } from '@island.is/api/schema'
import React from 'react'

const User = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const user = useLoaderData() as UserProfileResult
  const formattedNationalId = formatNationalId(user.nationalId)
  const [updateProfile] = useUpdateUserProfileMutation()
  const { revalidate } = useRevalidator()

  const handleUpdateProfile = async (input: UpdateUserProfileInput) => {
    try {
      const updatedProfile = await updateProfile({
        variables: {
          nationalId: user.nationalId,
          input,
        },
      })

      if (updatedProfile.data) {
        revalidate()
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Stack space={'containerGutter'}>
      <BackButton
        onClick={() => {
          navigate(-1)
        }}
      />
      <div>
        <div>
          <IntroHeader
            title={user.fullName ?? formattedNationalId}
            intro={formattedNationalId}
          />
        </div>
        <Box display="flex" width="full" columnGap="smallGutter">
          <Box
            display="flex"
            flexDirection="column"
            rowGap="smallGutter"
            columnGap="gutter"
            width="full"
          >
            {[
              {
                textKey: m.documentNotification,
                value: user.documentNotifications ? m.yes : m.no,
              },
              {
                textKey: m.emailNotification,
                value: user.emailNotifications ? m.yes : m.no,
              },
              {
                textKey: m.language,
                value: user.locale === 'en' ? m.english : m.icelandic,
              },
            ].map(({ textKey, value }) => (
              <Box display="flex" columnGap="smallGutter" key={textKey.id}>
                <Text fontWeight="medium">{formatMessage(textKey)}: </Text>
                <Text>{formatMessage(value)}</Text>
              </Box>
            ))}
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            width="full"
            rowGap="smallGutter"
            columnGap="smallGutter"
          >
            {[
              {
                textKey: m.lastNudge,
                value: user.lastNudge,
              },
              {
                textKey: m.nextNudge,
                value: user.nextNudge,
              },
            ].map(({ textKey, value }) => (
              <Box display="flex" columnGap="smallGutter" key={textKey.id}>
                <Text fontWeight="medium">{formatMessage(textKey)}: </Text>
                <Text>{format(new Date(value as string), dateFormat.is)}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      </div>
      <Stack space="gutter">
        <Text variant="h4">{formatMessage(m.info)}</Text>
        <Box
          rowGap="gutter"
          columnGap="gutter"
          display="flex"
          flexDirection={['column', 'row', 'row']}
          width="full"
        >
          <Box width="full">
            <ActionCard
              heading={formatMessage(m.email)}
              text={user.email ?? ''}
              cta={
                !user.email || user.emailVerified
                  ? undefined
                  : {
                      label: formatMessage(m.delete),
                      buttonType: {
                        variant: 'text',
                        colorScheme: 'destructive',
                      },
                      size: 'small',
                      icon: 'trash',
                      onClick: () => handleUpdateProfile({ email: '' }),
                    }
              }
              tag={{
                label: formatMessage(
                  !user.email
                    ? m.noEmail
                    : user.emailVerified
                    ? m.verified
                    : m.unverified,
                ),
                variant: 'blue',
                outlined: true,
              }}
            />
          </Box>
          <Box width="full">
            <ActionCard
              heading={formatMessage(m.phone)}
              text={user.mobilePhoneNumber ?? ''}
              cta={
                !user.mobilePhoneNumber || user.mobilePhoneNumberVerified
                  ? undefined
                  : {
                      label: formatMessage(m.delete),
                      buttonType: {
                        variant: 'text',
                        colorScheme: 'destructive',
                      },
                      size: 'small',
                      icon: 'trash',
                      onClick: () =>
                        handleUpdateProfile({ mobilePhoneNumber: '' }),
                    }
              }
              tag={{
                label: formatMessage(
                  !user.mobilePhoneNumber
                    ? m.noMobilePhone
                    : user.mobilePhoneNumberVerified
                    ? m.verified
                    : m.unverified,
                ),
                variant: 'blue',
                outlined: true,
              }}
            />
          </Box>
        </Box>
      </Stack>
    </Stack>
  )
}

export default User
