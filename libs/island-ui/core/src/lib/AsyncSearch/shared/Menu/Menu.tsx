import React, { forwardRef, ReactNode } from 'react'
import cn from 'classnames'

import * as styles from './Menu.treat'

interface MenuProps {
  isOpen: boolean
  children: ReactNode
}

export const Menu = forwardRef<HTMLUListElement, MenuProps>(
  ({ isOpen, children, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        {...props}
        className={cn(styles.menu, { [styles.open]: isOpen })}
      >
        {children}
      </ul>
    )
  },
)

export default Menu
