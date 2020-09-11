import React, { ElementType, AllHTMLAttributes, forwardRef } from 'react'
import cn from 'classnames'
import { useToggle } from 'react-use'
import { Link } from '../Link'
import { Box } from '../Box'
import { UseBoxStylesProps } from '../Box/useBoxStyles'
import * as styles from './FocusableBox.treat'

interface Props
  extends Omit<UseBoxStylesProps, 'component'>,
    Omit<AllHTMLAttributes<HTMLElement>, 'width' | 'height' | 'className'> {
  component?: ElementType
}

// FocusableBox is a wrapper component that handles focus styles.
// Most props are forwarded to Box.
// By default it renders as a Link component.

const FocusableBox = forwardRef<HTMLElement, Props>(
  ({
    component = Link,
    display = 'flex',
    children,
    className,
    onFocus,
    onBlur,
    ...rest
  }) => {
    const [isFocused, toggle] = useToggle(false)

    return (
      <Box
        component={component}
        display={display}
        className={cn(styles.focusable, className)}
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
