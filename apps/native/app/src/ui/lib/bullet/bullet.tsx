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
        color={theme.color.red400}
        size={12}
        style={{
          marginRight: theme.spacing[1],
          lineHeight: 24,
        }}
      >
        {'\u25CF'}
      </Typography>
      <Typography>{children}</Typography>
    </Host>
  )
}
