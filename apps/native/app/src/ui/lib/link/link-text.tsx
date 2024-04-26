import React from 'react'
import styled, { useTheme } from 'styled-components/native'
import { Typography } from '../typography/typography'

const Host = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.color.blue400};
  margin-bottom: 1px;
`

interface LinkTextProps {
  children: string | React.ReactNode
}

export function LinkText({ children }: LinkTextProps) {
  const theme = useTheme()
  return (
    <Host>
      <Typography variant="heading5" color={theme.color.blue400}>
        {children}
      </Typography>
    </Host>
  )
}
