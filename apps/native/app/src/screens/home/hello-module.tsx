import * as FileSystem from 'expo-file-system'
import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Image, SafeAreaView } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { DISMISSED_KEYS } from '../../constants/dissmissed-keys'
import { useGetFrontPageImageQuery } from '../../graphql/types/schema'
import { useAuthStore } from '../../stores/auth-store'
import { usePreferencesStore } from '../../stores/preferences-store'
import { Skeleton, Typography } from '../../ui'

const Host = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const ImageWrapper = styled.View`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
`

const getFileExtension = (url: string): string => {
  const extension = url.split('.').pop()
  return extension ? `.${extension}` : ''
}

export const HelloModule = React.memo(() => {
  const theme = useTheme()
  const { dismissed, graphicWidgetEnabled } = usePreferencesStore()
  const { userInfo } = useAuthStore()
  const [imageSrc, setImageSrc] = React.useState<string | undefined>(undefined)

  const { data: image, loading } = useGetFrontPageImageQuery({
    variables: { input: { pageIdentifier: 'frontpage' } },
  })

  const cacheDirectory = `${FileSystem.cacheDirectory}homeScreenImages`

  // Need to add extension to the title due to an issue in react native https://github.com/facebook/react-native/issues/42234
  const fileExtension = image?.getFrontpage?.imageMobile?.url
    ? getFileExtension(image?.getFrontpage?.imageMobile?.url)
    : ''

  const titleWithExtension = image?.getFrontpage?.imageMobile?.title
    ? `${image?.getFrontpage?.imageMobile?.title}${fileExtension}`
    : undefined

  const handleImage = async () => {
    if (!image || !titleWithExtension) {
      return
    }

    const localPath = `${cacheDirectory}/${titleWithExtension}`
    const fileInfo = await FileSystem.getInfoAsync(localPath)
    // Use image from cache if it exists
    if (fileInfo.exists) {
      setImageSrc(fileInfo.uri)
    } else {
      const imageSource = image.getFrontpage?.imageMobile?.url
      if (!imageSource) {
        return
      }
      setImageSrc(imageSource)
      // Download image and save in cache
      const downloadResumable = FileSystem.createDownloadResumable(
        imageSource,
        localPath,
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
  }

  useEffect(() => {
    handleImage()
  }, [image])

  // If the onboardingWidget is shown, don't show this module
  if (!dismissed.includes(DISMISSED_KEYS.ONBOARDING_WIDGET)) {
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
        {graphicWidgetEnabled && imageSrc && (
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
