import React, { useCallback } from 'react'
import { Alert, Linking } from 'react-native'
import styled from 'styled-components/native'
import { font } from '../../utils/font'

const Host = styled.TouchableOpacity``

const Text = styled.Text`
  ${font({
    fontWeight: '300',
    lineHeight: 24,
  })}
`

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
      <Text>{children}</Text>
    </Host>
  )
}
