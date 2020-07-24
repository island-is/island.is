import React, { FC, useState, useRef } from 'react'
import { Box, Icon, Stack } from '@island.is/island-ui/core'
import cn from 'classnames'
import * as styles from './ActionMenu.treat'
// eslint-disable-next-line
import useOutsideClick from 'apps/service-portal/src/hooks/useOutsideClick/useOutsideClick'

interface ActionMenuItemProps {
  onClick?: () => void
}

export const ActionMenuItem: FC<ActionMenuItemProps> = ({
  onClick,
  children,
}) => (
  <button className={styles.menuItem} onClick={onClick}>
    {children}
  </button>
)

const ActionMenu: FC<{}> = ({ children }) => {
  const ref = useRef()
  const [isOpen, setIsOpen] = useState(false)

  const handleTriggerClick = () => setIsOpen(!isOpen)

  useOutsideClick(ref, () => setIsOpen(false))

  return (
    <Box position="relative" ref={ref}>
      <button className={styles.trigger} onClick={handleTriggerClick}>
        <Icon type="bullet" width={4} height={4} color="blue300" />
        <Icon type="bullet" width={4} height={4} color="blue300" />
        <Icon type="bullet" width={4} height={4} color="blue300" />
      </button>
      <div
        className={cn(styles.menu, {
          [styles.menuClosed]: !isOpen,
          [styles.menuOpen]: isOpen,
        })}
      >
        <Stack space={[0, 1]} dividers>
          {children}
        </Stack>
      </div>
    </Box>
  )
}

export default ActionMenu
