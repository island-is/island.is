import React from 'react'
import styled, { useTheme } from 'styled-components/native'
import { Typography } from '../typography/typography'

const Host = styled.View`
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing.smallGutter}px;
  margin-bottom: ${({ theme }) => theme.spacing.smallGutter}px;
`

interface BulletProps {
  children: React.ReactNode
}

export function Bullet({ children }: BulletProps) {
  const theme = useTheme()
  return (
    <Host>
      <Typography
        color={theme.tokens.feedback.error.foreground}
        size={12}
        lineHeight={22}
        style={{ marginRight: theme.spacing[1] }}
      >
        {'\u25CF'}
      </Typography>
      <Typography>{children}</Typography>
    </Host>
  )
}
