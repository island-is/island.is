import React, { useCallback } from 'react'
import styled from 'styled-components/native'
import { Typography } from '../typography/typography'
import { useBrowser } from '../../../hooks/use-browser'

const Host = styled.TouchableOpacity``

interface LinkProps {
  url: string
  children: React.ReactNode
}

export function Link({ url, children }: LinkProps) {
  const browser = useBrowser()
  const handlePress = useCallback(() => {
    browser.openBrowser(url)
  }, [url, browser])

  return (
    <Host onPress={handlePress}>
      <Typography>{children}</Typography>
    </Host>
  )
}
