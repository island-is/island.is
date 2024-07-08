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

  const { data: title, loading } = useGetFrontPageImageTitleQuery({
    variables: { input: { pageIdentifier: 'frontpage' } },
  })

  const imageTitle = title?.getFrontpage?.imageMobile?.title

  const cacheDirectory = `${FileSystem.documentDirectory}homeScreenImages`

  const checkImage = async () => {
    // If we don't have a title, for example when we are offline, check if we have any image in the cache and use that
    if (!imageTitle) {
      FileSystem.readDirectoryAsync(cacheDirectory).then((files) => {
        if (files.length > 0) {
          setImageSrc(`${cacheDirectory}/${files[0]}`)
        }
      })
      return
    }

    // Check if title of the image that we fetched from server is the same as the one we have in cache
    const fileInfo = await FileSystem.getInfoAsync(
      `${cacheDirectory}/${imageTitle}`,
    )

    if (fileInfo.exists) {
      // If we have the image in cache, use it
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
          `${cacheDirectory}/${imageTitle}`,
        )
        try {
          const directoryInfo = await FileSystem.getInfoAsync(cacheDirectory)
          if (!directoryInfo.exists) {
            await FileSystem.makeDirectoryAsync(cacheDirectory, {
              intermediates: true,
            })
          }
          await downloadResumable.downloadAsync()
        } catch (e) {
          console.error(e)
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

        {imageSrc && (
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
