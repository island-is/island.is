import React from 'react'
import styled, { useTheme } from 'styled-components/native'
import { Typography } from '../typography/typography'

const Host = styled.View`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.border.radius.large};
  padding: ${({ theme }) => theme.spacing[1]}px;
`

export const badgeColorSchemes = {
  blue: {
    color: 'blue400',
    backgroundColor: 'blue100',
    borderColor: 'blue200',
  },
  mint: {
    color: 'mint800',
    backgroundColor: 'mint200',
    borderColor: 'mint300',
  },
  blueberry: {
    color: 'blueberry400',
    backgroundColor: 'blueberry100',
    borderColor: 'blueberry200',
  },
  darkerBlue: {
    color: 'blue600',
    backgroundColor: 'blue200',
    borderColor: 'blue300',
  },
  white: {
    color: 'blue400',
    backgroundColor: 'white',
    borderColor: 'blue100',
  },
  purple: {
    color: 'purple400',
    backgroundColor: 'purple100',
    borderColor: 'purple200',
  },
  red: {
    color: 'red600',
    backgroundColor: 'red100',
    borderColor: 'red200',
  },
  rose: {
    color: 'roseTinted400',
    backgroundColor: 'roseTinted100',
    borderColor: 'roseTinted200',
  },
  dark: {
    color: 'dark400',
    backgroundColor: 'dark200',
    borderColor: 'dark300',
  },
  yellow: {
    color: 'dark400',
    backgroundColor: 'yellow400',
    borderColor: 'yellow400',
  },
  disabled: {
    color: 'dark200',
    backgroundColor: 'dark100',
    borderColor: 'dark200',
  },
  warn: {
    color: 'dark400',
    backgroundColor: 'yellow200',
    borderColor: 'yellow300',
  },
} as const

interface BadgeProps {
  title: string
  variant: keyof typeof badgeColorSchemes
  outlined?: boolean
  fill?: boolean
}

export function Badge({
  title,
  variant = 'blue',
  outlined = false,
  fill = false,
}: BadgeProps) {
  const theme = useTheme()
  const badgeVariant = badgeColorSchemes[variant] ?? 'blue'
  return (
    <Host
      style={{
        backgroundColor: fill
          ? theme.color[badgeVariant.backgroundColor]
          : outlined
          ? 'transparent'
          : theme.color[badgeVariant.backgroundColor],
        borderColor: outlined
          ? theme.color[badgeVariant.borderColor]
          : 'transparent',
        borderWidth: outlined ? 1 : 0,
      }}
    >
      <Typography variant="eyebrow" color={theme.color[badgeVariant.color]}>
        {title}
      </Typography>
    </Host>
  )
}
