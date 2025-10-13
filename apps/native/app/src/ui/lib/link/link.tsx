import React, { useCallback } from 'react'
import { Alert, Linking } from 'react-native'
import styled from 'styled-components/native'
import { Typography } from '../typography/typography'

const Host = styled.TouchableOpacity<{ underlined: boolean }>`
  border-bottom-width: ${({ underlined }) => (underlined ? 1 : 0)}px;
  border-bottom-color: ${(props) => props.theme.color.blue400};
`

interface LinkProps {
  url: string
  underlined?: boolean
  children: React.ReactNode
}

export function Link({ url, children, underlined = false }: LinkProps) {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url)

    if (supported) {
      await Linking.openURL(url)
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`)
    }
  }, [url])

  return (
    <Host onPress={handlePress} underlined={underlined}>
      <Typography>{children}</Typography>
    </Host>
  )
}
