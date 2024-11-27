import React, { FC, useState, useRef } from 'react'
import { useClickAway } from 'react-use'
import { Box, Stack } from '@island.is/island-ui/core'
import * as styles from './ActionMenu.css'

interface ActionMenuItemProps {
  onClick?: () => void
}

export const ActionMenuItem: FC<
  React.PropsWithChildren<ActionMenuItemProps>
> = ({ onClick, children }) => (
  <button className={styles.menuItem} onClick={onClick}>
    {children}
  </button>
)

export const ActionMenu: FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const ref = useRef<HTMLElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleTriggerClick = () => setIsOpen(!isOpen)

  useClickAway(ref, () => setIsOpen(false))

  return (
    <Box position="relative" ref={ref}>
      <button className={styles.trigger} onClick={handleTriggerClick}>
        <Box
          className={styles.dot}
          background="blue400"
          borderRadius="circle"
        />
        <Box
          className={styles.dot}
          background="blue400"
          borderRadius="circle"
        />
        <Box
          className={styles.dot}
          background="blue400"
          borderRadius="circle"
        />
      </button>
      {isOpen && (
        <Box
          paddingY={2}
          paddingX={3}
          background="blue100"
          border="standard"
          borderRadius="standard"
          className={styles.menu}
        >
          <Stack space={[0, 1]} dividers>
            {children}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default ActionMenu
