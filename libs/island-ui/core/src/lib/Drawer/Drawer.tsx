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
  preventBodyScroll?: ModalBaseProps['preventBodyScroll']
  backdropWhite?: ModalBaseProps['backdropWhite']
  backdropDark?: ModalBaseProps['backdropDark']
  backdropTransparent?: ModalBaseProps['backdropTransparent']
  /**
   * Extra classes for the modal panel (e.g. responsive width overrides).
   */
  panelClassName?: string
  /**
   * Classes for the scrollable inner container. When set, default overflow is omitted so you can e.g. use overflow-x: hidden with overflow-y: auto.
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
  preventBodyScroll,
  backdropWhite,
  backdropDark,
  backdropTransparent,
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
      preventBodyScroll={preventBodyScroll}
      backdropWhite={backdropWhite}
      backdropDark={backdropDark}
      backdropTransparent={backdropTransparent}
      className={cn(styles.drawer, styles.position[position], panelClassName)}
    >
      {({ closeModal }: { closeModal: () => void }) => {
        return (
          <Box
            background="white"
            paddingY={[3, 6, 8]}
            paddingX={[3, 6, 8]}
            height="full"
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
            <Box>{children}</Box>
          </Box>
        )
      }}
    </ModalBase>
  )
}

export default Drawer
