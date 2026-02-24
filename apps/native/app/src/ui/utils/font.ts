/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextStyle } from 'react-native'
import { css, DefaultTheme } from 'styled-components/native'
import { dynamicColor, DynamicColorProps } from './dynamic-color'

type ThemeProps = { [key: string]: any; theme: DefaultTheme }
type ThemePropsFn<T> = (props: ThemeProps) => T
type ThemePropsFnType<T> = T | ThemePropsFn<T>
type FontFamily =
  | 'IBMPlexSans_100Thin'
  | 'IBMPlexSans_200ExtraLight'
  | 'IBMPlexSans_300Light'
  | 'IBMPlexSans_400Regular'
  | 'IBMPlexSans_500Medium'
  | 'IBMPlexSans_600SemiBold'
  | 'IBMPlexSans_700Bold'
  | 'IBMPlexSans_100Thin_Italic'
  | 'IBMPlexSans_200ExtraLight_Italic'
  | 'IBMPlexSans_300Light_Italic'
  | 'IBMPlexSans_400Regular_Italic'
  | 'IBMPlexSans_500Medium_Italic'
  | 'IBMPlexSans_600SemiBold_Italic'
  | 'IBMPlexSans_700Bold_Italic'

interface FontSettings {
  fontWeight?: ThemePropsFnType<TextStyle['fontWeight']>
  color?: DynamicColorProps<any>
  fontSize?: ThemePropsFnType<number>
  lineHeight?: ThemePropsFnType<number>
}

export const lineHeightByFontSize = (fontSize: number) => {
  switch (fontSize) {
    case 16:
      return 20
    case 18:
      return 24
    case 20:
      return 26
    case 26:
      return 32
    case 32:
      return 38
  }

  return Math.ceil(fontSize * 1.25)
}

export const fontByWeight = (weight: TextStyle['fontWeight']): FontFamily => {
  switch (weight) {
    case '900':
    case '800':
    case '700':
    case 'bold':
      return 'IBMPlexSans_700Bold'
    case '600':
      return 'IBMPlexSans_600SemiBold'
    case '500':
      return 'IBMPlexSans_500Medium'
    case 'normal':
    case '400':
      return 'IBMPlexSans_400Regular'
    case '300':
      return 'IBMPlexSans_300Light'
    case '200':
      return 'IBMPlexSans_200ExtraLight'
    case '100':
      return 'IBMPlexSans_100Thin'
  }

  return 'IBMPlexSans_400Regular'
}

const propOrValue = (props: ThemeProps) => (value: any) => {
  return typeof value === 'function' ? value(props) : value
}

export function font(settings: FontSettings = {}) {
  const fontWeight = settings.fontWeight ?? 'normal'
  const color = settings.color ?? 'foreground'
  const fontSize = settings.fontSize ?? 16
  const lineHeight = settings.lineHeight

  return css`
    font-family: ${(props) => fontByWeight(propOrValue(props)(fontWeight))};
    color: ${dynamicColor(color)};
    font-size: ${(props) => propOrValue(props)(fontSize)}px;
    font-weight: ${fontWeight};
    line-height: ${(props) =>
      typeof lineHeight === 'undefined'
        ? lineHeightByFontSize(propOrValue(props)(fontSize))
        : propOrValue(props)(lineHeight)}px;
  `
}
