import React, { forwardRef, ReactNode } from 'react'
import cn from 'classnames'
import { Box } from '@island.is/island-ui/core'

import * as styles from './MenuButton.treat'

export interface MenuButtonProps {
  disabled?: boolean
  onClick?: () => void
  children?: ReactNode
  loading?: boolean
}

const MenuButton = forwardRef<
  HTMLAnchorElement & HTMLButtonElement,
  MenuButtonProps
>(({ children, onClick }, ref) => {
  const className = cn(styles.menuButton)
  const sharedProps = {
    className,
  }

  return (
    <button ref={ref} onClick={onClick} {...sharedProps}>
      <Box padding={5}>{children}</Box>
    </button>
  )
})

export default MenuButton
