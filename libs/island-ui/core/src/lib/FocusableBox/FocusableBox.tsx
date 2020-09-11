import React, {
  ElementType,
  AllHTMLAttributes,
  forwardRef,
  useContext,
} from 'react'
import cn from 'classnames'
import { useToggle } from 'react-use'
import { Link } from '../Link'
import { Box } from '../Box'
import { UseBoxStylesProps } from '../Box/useBoxStyles'
import {
  ColorSchemeContext,
  ColorSchemes,
} from '../context/ColorSchemeContext/ColorSchemeContext'

import * as styles from './FocusableBox.treat'

interface Props
  extends Omit<UseBoxStylesProps, 'component'>,
    Omit<AllHTMLAttributes<HTMLElement>, 'width' | 'height' | 'className'> {
  component?: ElementType
  color?: ColorSchemes
}

// FocusableBox is a wrapper component that handles focus styles.
// Most props are forwarded to Box.
// By default it renders as a Link component.

const FocusableBox = forwardRef<HTMLElement, Props>(
  ({
    component = Link,
    display = 'flex',
    borderRadius = 'large',
    color = 'purple',
    children,
    className,
    onFocus,
    onBlur,
    ...rest
  }) => {
    const { colorScheme } = useContext(ColorSchemeContext)
    const [isFocused, toggle] = useToggle(false)

    return (
      <Box
        component={component}
        display={display}
        borderRadius={borderRadius}
        className={cn(
          styles.focusable,
          styles.colorSchemes[colorScheme || color],
          className,
        )}
        onFocus={toggle}
        onBlur={toggle}
        {...rest}
      >
        {typeof children === 'function' ? children({ isFocused }) : children}
      </Box>
    )
  },
)

export default FocusableBox
