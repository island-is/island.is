import React, { PropsWithChildren } from 'react'
import { Button } from '../Button/Button'
import { Box } from '../Box/Box'
import { ModalBase, type ModalBaseProps } from '../ModalBase/ModalBase'
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
   * Optional when controlling visibility with `isVisible`.
   */
  disclosure?: React.ReactElement
  /**
   * Show immediately without clicking the disclosure button
   */
  initialVisibility?: boolean | undefined
  /**
   * Position of the drawer
   */
  position?: 'right' | 'left'
  /**
   * Control visibility from outside (passed through to ModalBase).
   */
  isVisible?: ModalBaseProps['isVisible']
  onVisibilityChange?: ModalBaseProps['onVisibilityChange']
  hideOnClickOutside?: ModalBaseProps['hideOnClickOutside']
  /**
   * Extra classes for the modal panel (e.g. width overrides).
   */
  panelClassName?: string
  /**
   * Classes for the inner container. When set, default padding and overflow
   * are omitted so the consumer can control scrolling and spacing.
   */
  contentClassName?: string
}

export const Drawer = ({
  ariaLabel,
  baseId,
  disclosure,
  initialVisibility,
  position = 'right',
  isVisible,
  onVisibilityChange,
  hideOnClickOutside,
  panelClassName,
  contentClassName,
  children,
}: PropsWithChildren<DrawerProps>) => {
  return (
    <ModalBase
      disclosure={disclosure}
      baseId={baseId}
      modalLabel={ariaLabel}
      initialVisibility={initialVisibility}
      isVisible={isVisible}
      onVisibilityChange={onVisibilityChange}
      hideOnClickOutside={hideOnClickOutside}
      className={cn(styles.drawer, styles.position[position], panelClassName)}
    >
      {({ closeModal }: { closeModal: () => void }) => {
        return (
          <Box
            background="white"
            paddingY={contentClassName ? undefined : [3, 6, 8]}
            paddingX={contentClassName ? undefined : [3, 6, 8]}
            height="full"
            display={contentClassName ? 'flex' : undefined}
            flexDirection={contentClassName ? 'column' : undefined}
            overflow={contentClassName ? undefined : 'auto'}
            className={contentClassName}
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
            <Box className={contentClassName ? styles.contentFill : undefined}>
              {children}
            </Box>
          </Box>
        )
      }}
    </ModalBase>
  )
}

export default Drawer
