import React, { PropsWithChildren } from 'react'
import { Button } from '../Button/Button'
import { Box } from '../Box/Box'
import { ModalBase } from '../ModalBase/ModalBase'
import cn from 'classnames'
import * as styles from './Drawer.css'

interface DrawerProps {
  /**
   * Explain what this drawer is for
   */
  ariaLabel: string
  /**
   * Unique ID for accessibility purposes
   */
  baseId: string
  /**
   * Element that opens the drawer.
   * It will be forwarded neccessery props for a11y and event handling.
   */
  disclosure: React.ReactElement
  /**
   * Show immediately without clicking the disclosure button
   */
  initialVisibility?: boolean | undefined
  /**
   * Position of the drawer
   */
  position?: 'right' | 'left'
}

export const Drawer = ({
  ariaLabel,
  baseId,
  disclosure,
  initialVisibility,
  position = 'right',
  children,
}: PropsWithChildren<DrawerProps>) => {
  return (
    <ModalBase
      disclosure={disclosure}
      baseId={baseId}
      modalLabel={ariaLabel}
      initialVisibility={initialVisibility}
      className={cn(styles.drawer, styles.position[position])}
    >
      {({ closeModal }: { closeModal: () => void }) => {
        return (
          <Box
            background="white"
            paddingY={[3, 6, 8]}
            paddingX={[3, 6, 8]}
            height="full"
            overflow="auto"
          >
            <Box className={styles.closeButton}>
              <Button
                circle
                colorScheme="negative"
                icon="close"
                aria-label="Close drawer"
                onClick={closeModal}
                size="large"
              />
            </Box>
            <Box>{children}</Box>
          </Box>
        )
      }}
    </ModalBase>
  )
}

export default Drawer
