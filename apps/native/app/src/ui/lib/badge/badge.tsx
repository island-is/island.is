import React from 'react'
import styled, { useTheme } from 'styled-components/native'
import { Tokens } from '../../utils'
import { Typography } from '../typography/typography'

const Host = styled.View`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.border.radius.large};
  padding: ${({ theme }) => theme.spacing[1]}px;
`

type BadgeColours = { background: string; accent: string; border: string }

// The Brand Guide tag tokens, plus the app's own white, dark, disabled and warn
// schemes.
type BadgeVariant =
  | 'blue'
  | 'mint'
  | 'blueberry'
  | 'darkerBlue'
  | 'white'
  | 'purple'
  | 'red'
  | 'rose'
  | 'dark'
  | 'yellow'
  | 'disabled'
  | 'warn'

export const badgeColorSchemes: Record<
  BadgeVariant,
  (tokens: Tokens) => BadgeColours
> = {
  blue: (t) => t.feedback.tags.blue,
  mint: (t) => t.feedback.tags.mint,
  blueberry: (t) => t.feedback.tags.blueberry,
  darkerBlue: (t) => t.feedback.tags.darkerBlue,
  white: (t) => t.app.tags.white,
  purple: (t) => t.feedback.tags.purple,
  red: (t) => t.feedback.tags.red,
  rose: (t) => t.feedback.tags.rose,
  dark: (t) => t.app.tags.dark,
  yellow: (t) => t.feedback.tags.yellow,
  disabled: (t) => t.app.tags.disabled,
  warn: (t) => t.app.tags.warn,
}

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
  const colours = (badgeColorSchemes[variant] ?? badgeColorSchemes.blue)(
    theme.tokens,
  )
  return (
    <Host
      style={{
        backgroundColor: fill
          ? colours.background
          : outlined
          ? 'transparent'
          : colours.background,
        borderColor: outlined ? colours.border : 'transparent',
        borderWidth: outlined ? 1 : 0,
      }}
    >
      <Typography
        variant="eyebrow"
        color={colours.accent}
        maxFontSizeMultiplier={1.5}
      >
        {title}
      </Typography>
    </Host>
  )
}
