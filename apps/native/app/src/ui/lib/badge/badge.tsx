import React from 'react'
import styled, { useTheme } from 'styled-components/native'
import { Typography } from '../typography/typography'

const Host = styled.View`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.border.radius.standard};
  padding: ${({ theme }) => theme.spacing[1]}px;
`

export const badgeColorSchemes = {
  blue: {
    color: 'blue400',
    backgroundColor: 'blue100',
  },
  mint: {
    color: 'mint800',
    backgroundColor: 'mint200',
  },
  blueberry: {
    color: 'blueberry400',
    backgroundColor: 'blueberry100',
  },
  darkerBlue: {
    color: 'blue600',
    backgroundColor: 'blue200',
  },
  white: {
    color: 'blue400',
    backgroundColor: 'white',
  },
  purple: {
    color: 'purple400',
    backgroundColor: 'purple100',
  },
  red: {
    color: 'red600',
    backgroundColor: 'red100',
  },
  rose: {
    color: 'roseTinted400',
    backgroundColor: 'roseTinted100',
  },
  dark: {
    color: 'dark400',
    backgroundColor: 'dark200',
  },
  yellow: {
    color: 'dark400',
    backgroundColor: 'yellow400',
  },
  disabled: {
    color: 'dark200',
    backgroundColor: 'dark100',
  },
  warn: {
    color: 'dark400',
    backgroundColor: 'yellow200',
  },
} as const

interface BadgeProps {
  title: string
  variant: keyof typeof badgeColorSchemes
}

export function Badge({ title, variant = 'blue' }: BadgeProps) {
  const theme = useTheme()
  const badgeVariant = badgeColorSchemes[variant] ?? 'blue'
  return (
    <Host
      style={{
        backgroundColor: theme.color[badgeVariant.backgroundColor],
      }}
    >
      <Typography variant="eyebrow" color={theme.color[badgeVariant.color]}>
        {title}
      </Typography>
    </Host>
  )
}
