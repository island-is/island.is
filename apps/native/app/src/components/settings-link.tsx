import React from 'react'
import { router } from 'expo-router'
import { useTheme } from 'styled-components/native'

import { Typography, TypographyVariant } from '@/ui'

interface SettingsLinkProps {
  children: React.ReactNode
  variant?: TypographyVariant
}

// Inline link to the settings screen, for use inside a run of body text.
export const SettingsLink = ({ children, variant }: SettingsLinkProps) => {
  const theme = useTheme()

  return (
    <Typography
      variant={variant}
      weight="600"
      color={theme.color.blue400}
      style={{ textDecorationLine: 'underline' }}
      accessibilityRole="link"
      onPress={() => router.navigate('/settings')}
    >
      {children}
    </Typography>
  )
}
