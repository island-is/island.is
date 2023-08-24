import React, { FC, useState, useEffect } from 'react'
import cn from 'classnames'
import * as styles from './ActionSidebar.css'
import { Box, Button } from '@island.is/island-ui/core'

interface Props {
  isActive: boolean
  onClose: () => void
}

export const ActionSidebar: FC<React.PropsWithChildren<Props>> = ({
  isActive,
  onClose,
  children,
}) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isActive && !show) setShow(true)
    else if (!isActive && show)
      setTimeout(() => setShow(false), styles.actionSidebarTransitionTiming)
  }, [isActive, show, setShow])

  if (!show) return null

  return (
    <>
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        className={cn(styles.overlay, {
          [styles.overlayExit]: !isActive,
        })}
        onClick={onClose}
      />
      <Box
        position="fixed"
        top={0}
        right={0}
        bottom={0}
        boxShadow="subtle"
        className={cn(styles.sidebar, {
          [styles.sidebarExit]: !isActive,
        })}
      >
        <Box position="relative" height="full" background="white">
          <Box className={styles.close}>
            <Button variant="utility" icon="close" onClick={onClose} />
          </Box>
          <div className={styles.scrollWrapper}>{children}</div>
        </Box>
      </Box>
    </>
  )
}

export default ActionSidebar
