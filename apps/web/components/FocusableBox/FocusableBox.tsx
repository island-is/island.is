import React, { FC, ElementType, AllHTMLAttributes } from 'react'
import cn from 'classnames'
import * as styles from './FocusableBox.treat'
import { Box, Link, UseBoxStylesProps } from '@island.is/island-ui/core'

interface Props
  extends Omit<UseBoxStylesProps, 'component'>,
    Omit<AllHTMLAttributes<HTMLElement>, 'width' | 'height' | 'className'> {
  component?: ElementType
}

const FocusableBox: FC<Props> = ({
  component = Link,
  display = 'flex',
  borderRadius = 'large',
  children,
  ...rest
}) => (
  <Box
    component={component}
    display={display}
    borderRadius={borderRadius}
    className={cn(styles.focusable)}
    {...rest}
  >
    {children}
  </Box>
)

export default FocusableBox
