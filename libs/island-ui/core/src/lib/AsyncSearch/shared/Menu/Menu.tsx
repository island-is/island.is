import React from 'react'
import cn from 'classnames'

import * as styles from './Menu.treat'

export const Menu = ({ isOpen, children, ...props }) => {
  return (
    <ul {...props} className={cn(styles.menu, { [styles.open]: isOpen })}>
      {children}
    </ul>
  )
}

export default Menu
