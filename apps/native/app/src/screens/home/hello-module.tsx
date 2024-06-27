import { Typography, Skeleton } from '@ui'

import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Image, SafeAreaView } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useAuthStore } from '../../stores/auth-store'
import { usePreferencesStore } from '../../stores/preferences-store'
import { useGetFrontPageImageQuery } from '../../graphql/types/schema'

const Host = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const ImageWrapper = styled.View`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
`

export const HelloModule = React.memo(() => {
  const theme = useTheme()
  const { dismissed } = usePreferencesStore()
  const { userInfo } = useAuthStore()

  const { data, loading, error } = useGetFrontPageImageQuery({
    variables: { input: { pageIdentifier: 'frontpage' } },
  })
  const imageSrc = data?.getFrontpage?.imageMobile?.url

  // If the onboardingWidget is shown, don't show this module
  if (!dismissed.includes('onboardingWidget')) {
    return null
  }

  return (
    <SafeAreaView
      style={{
        marginHorizontal: theme.spacing[2],
        marginTop: theme.spacing[2],
      }}
    >
      <Host>
        <Typography color={theme.color.purple400} weight="600">
          <FormattedMessage id="home.goodDay" defaultMessage="Góðan dag," />
        </Typography>
        <Typography
          variant={'heading2'}
          style={{ marginTop: theme.spacing[1] }}
        >
          {userInfo?.name}
        </Typography>

        {!error && (
          <ImageWrapper>
            {loading ? (
              <Skeleton
                height={167}
                style={{ borderRadius: theme.spacing[1] }}
              />
            ) : (
              <Image
                source={{ uri: imageSrc }}
                style={{ height: 167 }}
                resizeMode="contain"
              />
            )}
          </ImageWrapper>
        )}
      </Host>
    </SafeAreaView>
  )
})
