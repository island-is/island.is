import React, {
  AllHTMLAttributes,
  ElementType,
  forwardRef,
  Ref,
  useContext,
} from 'react'
import { useToggle } from 'react-use'
import cn from 'classnames'

import { Box, Link, UseBoxStylesProps } from '@island.is/island-ui/core'

import {
  ColorSchemeContext,
  ColorSchemes,
} from '../ColorSchemeContext/ColorSchemeContext'
import * as styles from './FocusableBox.css'

// TODO fix strict typing
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
interface Props
  extends Omit<UseBoxStylesProps, 'component'>,
    Omit<
      AllHTMLAttributes<HTMLElement>,
      'width' | 'height' | 'className' | 'color'
    > {
  component?: ElementType
  ref?: Ref<HTMLElement>
  color?: ColorSchemes
  children?:
    | React.ReactNode
    | ((props: { isFocused?: boolean; isHovered?: boolean }) => React.ReactNode)
}

type NoNullColorScheme = Exclude<ColorSchemes, null>

// FocusableBox is a wrapper component that handles focus styles.
// Most props are forwarded to Box.
// By default it renders as a Link component.

export const FocusableBox = forwardRef<HTMLElement, Props>(
  (
    {
      component = Link,
      display = 'flex',
      color = 'purple',
      children,
      className,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const { colorScheme } = useContext(ColorSchemeContext)
    const [isFocused, toggle] = useToggle(false)

    const colorKey: NoNullColorScheme =
      colorScheme ?? (color as NoNullColorScheme)

    return (
      <Box
        component={component}
        display={display}
        className={cn(
          styles.focusable,
          styles.colorSchemes[colorKey],
          className,
        )}
        onFocus={toggle}
        onBlur={toggle}
        ref={ref}
        {...rest}
      >
        {typeof children === 'function' ? children({ isFocused }) : children}
      </Box>
    )
  },
)
