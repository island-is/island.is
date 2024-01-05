import React, {
  ElementType,
  AllHTMLAttributes,
  forwardRef,
  useContext,
  Ref,
} from 'react'
import cn from 'classnames'
import { useToggle } from 'react-use'
import { Link } from '../Link/Link'
import { Box } from '../Box/Box'
import { UseBoxStylesProps } from '../Box/useBoxStyles'
import {
  ColorSchemeContext,
  ColorSchemes,
} from '../context/ColorSchemeContext/ColorSchemeContext'

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
  to?: string
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
    const [isFocused, toggleIsFocused] = useToggle(false)
    const [isHovered, toggleIsHovered] = useToggle(false)

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
        onFocus={toggleIsFocused}
        onBlur={toggleIsFocused}
        onMouseOver={toggleIsHovered}
        onMouseOut={toggleIsHovered}
        ref={ref}
        {...rest}
      >
        {typeof children === 'function'
          ? children({ isFocused, isHovered })
          : children}
      </Box>
    )
  },
)
