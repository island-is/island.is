/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamicColorIOS, DynamicColorIOSTuple, Platform } from 'react-native'
import { StyledProps, useTheme } from 'styled-components'
import { TokenSelector } from './tokens'

type DynamicColorFn<T> = (
  props: StyledProps<T & { [key: string]: any }>,
) => string | DynamicColorShape
export type DynamicColorProps<T> =
  | string
  | DynamicColorShape
  | DynamicColorFn<T>
type DynamicColorShape = {
  light: string
  dark: string
}

const androidShape = (shape: DynamicColorShape, props: StyledProps<any>) => {
  return props.theme.isDark ? shape.dark : shape.light
}

const FORCE_NORMAL = false

export function dynamicColor<T>(
  dynamicProps: DynamicColorProps<T>,
  onlyAuto = false,
) {
  // fix typing of (string & {})
  const input: string | DynamicColorFn<T> | DynamicColorShape = dynamicProps

  return (props: StyledProps<T>) => {
    const force =
      FORCE_NORMAL || (onlyAuto && props.theme.appearanceMode !== 'automatic')
    if (Platform.OS === 'android' || force) {
      if (typeof input === 'string') {
        return input
      } else if (typeof input === 'function') {
        const output: string | DynamicColorShape = input(props)
        if (typeof output === 'string') {
          return output
        } else {
          return androidShape(output, props)
        }
      } else {
        return androidShape(input, props)
      }
    } else {
      let shape = {
        dark: 'red',
        light: 'red',
      }

      if (typeof input === 'string') {
        shape = { light: input, dark: input }
      } else if (typeof input === 'function') {
        const output: string | DynamicColorShape = input(props)
        if (typeof output === 'string') {
          shape = { light: output, dark: output }
        } else {
          shape = output
        }
      } else {
        shape = input
      }

      return `color(DynamicColor, '${JSON.stringify(shape)}')`
    }
  }
}

export function useDynamicColor() {
  const theme = useTheme()
  const res = (tuple: DynamicColorIOSTuple) => {
    if (Platform.OS === 'ios') {
      return DynamicColorIOS(tuple)
    } else {
      return theme.isDark ? tuple.dark : tuple.light
    }
  }
  res.theme = theme
  return res
}

// Styled-components interpolation for a semantic token, e.g.
// `color: ${token((t) => t.foreground.primary)};`
export function token<T>(selector: TokenSelector) {
  return dynamicColor<T>(({ theme }) => ({
    light: selector(theme.tokenModes.light),
    dark: selector(theme.tokenModes.dark),
  }))
}

// Resolves a semantic token to a colour value for style props.
export function useTokenColor() {
  const dynamic = useDynamicColor()
  const { tokenModes } = dynamic.theme
  return (selector: TokenSelector) =>
    dynamic({
      light: selector(tokenModes.light),
      dark: selector(tokenModes.dark),
    })
}
