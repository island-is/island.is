import React from 'react'
import styled, { useTheme } from 'styled-components/native'
import { Typography } from '../typography/typography'

const Host = styled.View`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.border.radius.standard};
  padding: ${({ theme }) => theme.spacing[1]}px;
`

interface BadgeProps {
  title: string
  variant: 'mint' | 'blue' | 'blueberry'
}

const colorSchemes = {
  blue: {
    background: 'blue100',
    titleColor: 'blue400',
  },
  mint: {
    background: 'mint200',
    titleColor: 'mint800',
  },
  blueberry: {
    background: 'blueberry100',
    titleColor: 'blueberry400',
  },
} as const

export function Badge({ title, variant = 'blue' }: BadgeProps) {
  const theme = useTheme()
  return (
    <Host
      style={{ backgroundColor: theme.color[colorSchemes[variant].background] }}
    >
      <Typography
        variant="eyebrow"
        color={theme.color[colorSchemes[variant].titleColor]}
      >
        {title}
      </Typography>
    </Host>
  )
}
