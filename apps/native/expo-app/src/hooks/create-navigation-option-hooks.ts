import defaultsDeep from 'lodash/defaultsDeep'
import { useEffect } from 'react'
import { IntlShape, createIntl, useIntl } from 'react-intl'
import { Options } from 'react-native-navigation'
import { useNavigation } from 'react-native-navigation-hooks/dist'
import { DefaultTheme, useTheme } from 'styled-components'
import { en } from '../messages/en'
import { is } from '../messages/is'
import { preferencesStore } from '../new-stores/preferences-store'
import { isAndroid } from '../utils/devices'
import { getThemeWithPreferences } from '../utils/get-theme-with-preferences'

type ApplyNavigationOptionsCallback = (
  theme: DefaultTheme,
  intl: IntlShape,
) => Options

const defaultOptions = (
  theme: DefaultTheme,
  staticOptions: Options,
): Options => {
  const options: Options = {}

  options.window = {
    backgroundColor: isAndroid
      ? theme.shade.background
      : {
          dark: theme.shades.dark.background,
          light: theme.shades.light.background,
        },
  }

  if (isAndroid) {
    options.layout = {
      backgroundColor: theme.shade.background,
      componentBackgroundColor: theme.shade.background,
    }
  }

  if (staticOptions.bottomTab) {
    options.bottomTab = {
      iconColor: theme.shade.foreground,
      selectedIconColor: theme.color.blue400,
      textColor: isAndroid
        ? theme.shade.foreground
        : { light: 'black', dark: 'white' },
      selectedTextColor: isAndroid
        ? theme.shade.foreground
        : { light: 'black', dark: 'white' },
    }
    if (isAndroid) {
      options.bottomTabs = {
        backgroundColor: theme.shade.background,
      }
    }
  }

  if (staticOptions.topBar) {
    options.topBar = {
      title: {
        color: isAndroid
          ? theme.shade.foreground
          : { light: 'black', dark: 'white' },
      },
      animateRightButtons: false,
      animateLeftButtons: false,
      noBorder: true,
    }
    if (isAndroid) {
      options.topBar.background = {
        color: theme.shade.background,
      }
    }
  }

  if (isAndroid) {
    options.bottomTabs = {
      backgroundColor: theme.shade.background,
    }
    options.topBar = {
      ...options.topBar,
      background: {
        color: theme.shade.background,
      },
    }
  }

  return options
}

export const createNavigationOptionHooks = (
  callback?: ApplyNavigationOptionsCallback,
  staticOptions: Options = {},
) => {
  return {
    useNavigationOptions(componentId: string) {
      const theme = useTheme()
      const intl = useIntl()
      const { mergeOptions } = useNavigation(componentId)

      useEffect(() => {
        const optionsToUpdate = callback?.(theme, intl)
        defaultsDeep(
          optionsToUpdate,
          staticOptions,
          defaultOptions(theme, staticOptions),
        )
        if (optionsToUpdate) {
          mergeOptions(optionsToUpdate)
        }
      }, [callback, theme, intl])
    },
    getNavigationOptions() {
      const preferences = preferencesStore.getState()
      const theme = getThemeWithPreferences({
        appearanceMode: preferences.appearanceMode,
      })
      const intl = createIntl({
        locale: preferences.locale,
        messages: preferences.locale === 'en-US' ? en : is,
      })
      const optionsToUpdate = callback?.(theme, intl) ?? {}
      return defaultsDeep(
        optionsToUpdate,
        staticOptions,
        defaultOptions(theme, staticOptions),
      )
    },
  }
}
