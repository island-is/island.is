import React, { useCallback } from 'react'
import { Alert, Linking } from 'react-native'
import styled from 'styled-components/native'
import { Typography } from '../typography/typography'

const Host = styled.TouchableOpacity``

interface LinkProps {
  url: string
  children: React.ReactNode
}

export function Link({ url, children }: LinkProps) {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url)

    if (supported) {
      await Linking.openURL(url)
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`)
    }
  }, [url])

  return (
    <Host onPress={handlePress}>
      <Typography>{children}</Typography>
    </Host>
  )
}
