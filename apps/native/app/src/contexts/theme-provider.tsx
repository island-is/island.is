import React from 'react'
import { theme } from '@island.is/island-ui/theme';
import { Appearance, useColorScheme } from 'react-native';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { useEffect } from 'react';
import { Options } from 'react-native-navigation';
import { useNavigation } from 'react-native-navigation-hooks/dist';
import { userPreferencesStore, AppearanceMode } from '../stores/preferences-store';

export const shades = {
  light: {
    background: '#ffffff',
    foreground: '#000000',
    shade600: '#8E8E93',
    shade500: '#AEAEB2',
    shade400: '#C7C7CC',
    shade300: '#D1D1D6',
    shade200: '#E5E5EA',
    shade100: '#F2F2F7',
  },
  lightAccessible: {
    background: '#ffffff',
    foreground: '#000000',
    shade600: '#6C6C70',
    shade500: '#8E8E93',
    shade400: '#AEAEB2',
    shade300: '#BCBCC0',
    shade200: '#D8D8DC',
    shade100: '#EBEBF0',
  },
  dark: {
    background: '#000000',
    foreground: '#ffffff',
    shade600: '#98989D',
    shade500: '#636366',
    shade400: '#48484A',
    shade300: '#3A3A3C',
    shade200: '#2C2C2E',
    shade100: '#1C1C1E',
  },
  darkAccessible: {
    background: '#000000',
    foreground: '#ffffff',
    shade600: '#AEAEB2',
    shade500: '#7C7C80',
    shade400: '#545456',
    shade300: '#444446',
    shade200: '#363638',
    shade100: '#242426',
  },
}

export function useScreenOptions(callback: () => Options | null | void, deps: any[] = []) {
  const { mergeOptions } = useNavigation()
  useEffect(() => {
    const optionsToUpdate = callback();
    if (optionsToUpdate) {
      mergeOptions(optionsToUpdate);
    }
  }, deps);
}

export function getThemeWithPreferences({ appearanceMode }: { appearanceMode: AppearanceMode }) {
  // get color scheme from system if "automatic"
  const colorScheme = appearanceMode === 'automatic' ? Appearance.getColorScheme() : appearanceMode;
  // find correct shades key ("light" | "dark")
  const shadesKey = typeof colorScheme === 'string' ? colorScheme : 'light';
  return {
    ...theme,
    isDark: colorScheme !== 'light',
    colorScheme: shadesKey,
    shade: shades[shadesKey],
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preferences = userPreferencesStore();
  const selectedTheme = getThemeWithPreferences(preferences)

  return (
    <StyledThemeProvider theme={selectedTheme}>
      {children}
    </StyledThemeProvider>
  );
}
