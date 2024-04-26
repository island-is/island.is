/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextStyle } from 'react-native'
import { css, DefaultTheme } from 'styled-components/native'
import { dynamicColor, DynamicColorProps } from './dynamic-color'

type ThemeProps = { [key: string]: any; theme: DefaultTheme }
type ThemePropsFn<T> = (props: ThemeProps) => T
type ThemePropsFnType<T> = T | ThemePropsFn<T>
type FontFamily =
  | 'IBMPlexSans-Bold'
  | 'IBMPlexSans-SemiBold'
  | 'IBMPlexSans-Medium'
  | 'IBMPlexSans'
  | 'IBMPlexSans-Light'
  | 'IBMPlexSans-ExtraLight'
  | 'IBMPlexSans-Thin'

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
      return 'IBMPlexSans-Bold'
    case '600':
      return 'IBMPlexSans-SemiBold'
    case '500':
      return 'IBMPlexSans-Medium'
    case '300':
    case '200':
    case '100':
      return 'IBMPlexSans-Light'
    case 'normal':
    case '400':
      return 'IBMPlexSans'
  }

  // missing
  // '900' | '800' | '200' | '100'
  // 'IBMPlexSans-ExtraLight'
  // 'IBMPlexSans-Thin'

  return 'IBMPlexSans'
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
