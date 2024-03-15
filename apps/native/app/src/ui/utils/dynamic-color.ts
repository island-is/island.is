/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamicColorIOS, DynamicColorIOSTuple, Platform } from 'react-native'
import { Shade, StyledProps, useTheme } from 'styled-components'

type DynamicShade = keyof Shade
// eslint-disable-next-line @typescript-eslint/ban-types
type DynamicColorValue = DynamicShade | (string & {})
type DynamicColorFn<T> = (
  props: StyledProps<T & { [key: string]: any }>,
) => DynamicColorValue | DynamicColorShape
export type DynamicColorProps<T> =
  | DynamicColorValue
  | DynamicColorShape
  | DynamicColorFn<T>
type DynamicColorShape = {
  light: DynamicColorValue
  dark: DynamicColorValue
}
type SimpleColorShape = {
  light: string
  dark: string
}

const processString = (
  input: string | DynamicShade,
  props: StyledProps<any>,
) => {
  if (props.theme.shade[input]) {
    return props.theme.shade[input]
  }
  return input
}

const processShape = (shape: SimpleColorShape, props: StyledProps<any>) => {
  const result = shape
  if (props.theme.shades.dark[shape.dark]) {
    result.dark = props.theme.shades.dark[shape.dark]
  }
  if (props.theme.shades.light[shape.light]) {
    result.light = props.theme.shades.light[shape.light]
  }
  return result
}

const androidShape = (shape: SimpleColorShape, props: StyledProps<any>) => {
  const { light, dark } = processShape(shape, props)
  return props.theme.isDark ? dark : light
}

const FORCE_NORMAL = false

export function dynamicColor<T>(
  dynamicProps: DynamicColorProps<T>,
  onlyAuto = false,
) {
  // fix typing of (string & {})
  const input: string | DynamicColorFn<T> | SimpleColorShape = dynamicProps

  return (props: StyledProps<T>) => {
    const force =
      FORCE_NORMAL || (onlyAuto && props.theme.appearanceMode !== 'automatic')
    if (Platform.OS === 'android' || force) {
      if (typeof input === 'string') {
        return processString(input, props)
      } else if (typeof input === 'function') {
        const output: string | SimpleColorShape = input(props)
        if (typeof output === 'string') {
          return processString(output, props)
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
        shape = processShape({ light: input, dark: input }, props)
      } else if (typeof input === 'function') {
        const output: string | SimpleColorShape = input(props)
        if (typeof output === 'string') {
          shape = processShape({ light: output, dark: output }, props)
        } else {
          shape = processShape(output, props)
        }
      } else {
        shape = processShape(input, props)
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
