import React, {
  ElementType,
  AllHTMLAttributes,
  forwardRef,
  useContext
} from 'react'
import cn from 'classnames'
import { useToggle } from 'react-use'
import {  Link,
          Box, 
          UseBoxStylesProps,
          ColorSchemeContext,
          ColorSchemes, } from '@island.is/island-ui/core'

import * as styles from './FocusableClickBox.treat'

interface Props
  extends Omit<UseBoxStylesProps, 'component'>,
    Omit<AllHTMLAttributes<HTMLElement>, 'width' | 'height' | 'className'> {
  component?: ElementType
  color?: ColorSchemes
  //onClick?: React.MouseEvent<HTMLElement, MouseEvent>;
  onClick?: () => void
}

// FocusableClickBox is a wrapper component that handles focus styles.
// Most props are forwarded to Box.
// By default it renders as a Link component.

export const FocusableClickBox = forwardRef<HTMLElement, Props>(
  ({
    component = Link,
    display = 'flex',
    borderRadius = 'large',
    color = 'purple',
    children,
    className,
    onFocus,
    onBlur,
    onClick,
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
        onClick={onClick}
        {...rest}
      >
        {typeof children === 'function' ? children({ isFocused }) : children}
      </Box>
    )
  },
)

