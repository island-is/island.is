import { Typography, Skeleton } from '@ui'
import * as FileSystem from 'expo-file-system'

import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Image, SafeAreaView } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useAuthStore } from '../../stores/auth-store'
import { usePreferencesStore } from '../../stores/preferences-store'
import {
  useGetFrontPageImageLazyQuery,
  useGetFrontPageImageTitleQuery,
} from '../../graphql/types/schema'

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
  const [imageSrc, setImageSrc] = React.useState<string | undefined>(undefined)

  const [getFrontPageImageUrl] = useGetFrontPageImageLazyQuery({
    variables: { input: { pageIdentifier: 'frontpage' } },
  })

  const {
    data: title,
    loading,
    error,
  } = useGetFrontPageImageTitleQuery({
    variables: { input: { pageIdentifier: 'frontpage' } },
  })

  const imageTitle = title?.getFrontpage?.imageMobile?.title

  const checkImage = async () => {
    // Check if title of image is the same as the one we have in cache
    const fileInfo = await FileSystem.getInfoAsync(
      `${FileSystem.documentDirectory}${imageTitle}`,
    )

    if (fileInfo.exists) {
      // We have the correct image in the cache, use that one
      setImageSrc(fileInfo.uri)
      return
    }

    // We don't have the correct image in the cache, fetch it, download it and save to cache
    getFrontPageImageUrl().then(async (data) => {
      const imageSrcFromServer = data.data?.getFrontpage?.imageMobile?.url
      if (imageSrcFromServer) {
        setImageSrc(imageSrcFromServer)
        const downloadResumable = FileSystem.createDownloadResumable(
          imageSrcFromServer,
          `${FileSystem.documentDirectory}${imageTitle}`,
        )
        try {
          await downloadResumable.downloadAsync()
        } catch {
          // Do nothing, try again next time
        }
      }
    })
  }

  useEffect(() => {
    checkImage()
  }, [])

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
