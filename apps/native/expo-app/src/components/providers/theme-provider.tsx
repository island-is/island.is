import { theme } from '@/ui/utils/theme'
import React from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'

const themes = {
  light: {
    isDark: false,
    shade: {
      background: '#FFFFFF',
      foreground: '#00003C',
      shade700: '#8A8A8A',
      shade600: '#BFC1C0',
      shade500: '#CCCCD8',
      shade400: '#E4E3E2',
      shade300: '#EBEBEB',
      shade200: '#F2F2F5',
      shade100: '#FBFBFB',
    },
  },
  dark: {
    isDark: true,
    shade: {
      background: '#000000',
      foreground: '#F2F2F5',
      shade700: '#6E6E6E',
      shade600: '#4F4F50',
      shade500: '#434444',
      shade400: '#373737',
      shade300: '#2E2E2E',
      shade200: '#222222',
      shade100: '#141414',
    },
  },
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <StyledThemeProvider
      theme={{
        ...theme,
        ...themes.light,
        colorScheme: 'automatic',
        shades: {
          dark: themes.dark.shade,
          light: themes.light.shade,
        }
      }}
    >
      {children}
    </StyledThemeProvider>
  )
}
