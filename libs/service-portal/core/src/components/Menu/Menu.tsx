import React, { FC } from 'react'
import cn from 'classnames'
import * as styles from './Menu.treat'
import { Box, IconDeprecated as Icon } from '@island.is/island-ui/core'

interface Props {
  isOpen: boolean
  onCloseMenu: () => void
}

export const Menu: FC<Props> = ({ isOpen, children, onCloseMenu }) => {
  return (
    <>
      <Box
        position="fixed"
        top={0}
        right={0}
        bottom={0}
        left={0}
        className={cn(styles.overlay, {
          [styles.overlayIsOpen]: isOpen,
        })}
        onClick={onCloseMenu}
      />
      <Box
        position="relative"
        background="white"
        padding={3}
        borderRadius="large"
        className={cn(styles.menu, {
          [styles.isOpen]: isOpen,
        })}
      >
        <button className={styles.closeButton} onClick={onCloseMenu}>
          <Icon type="close" color="blue400" width={10} height={10} />
        </button>
        {children}
      </Box>
    </>
  )
}

export default Menu
