import React, { PropsWithChildren } from 'react'
import { ModalBase } from '../ModalBase/ModalBase'
import * as styles from './Filter.css'
import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { Button } from '../Button/Button'
import cn from 'classnames'

interface FilterMobileDrawerProps {
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

  labelCloseModal: string
}

export const FilterMobileDrawer = ({
  ariaLabel,
  baseId,
  disclosure,
  initialVisibility,
  labelCloseModal,
  children,
}: PropsWithChildren<FilterMobileDrawerProps>) => {
  return (
    <ModalBase
      disclosure={disclosure}
      baseId={baseId}
      modalLabel={ariaLabel}
      initialVisibility={initialVisibility}
      className={cn(styles.drawer, styles.position)}
    >
      {({ closeModal }: { closeModal: () => void }) => {
        return (
          <Box
            background="white"
            paddingTop={2}
            paddingX={0}
            height="full"
            overflow="auto"
            className={styles.mobileDrawerContainer}
          >
            <Box
              background="dark200"
              className={styles.drawerLine}
              onClick={closeModal}
            ></Box>
            {/* <Box className={styles.closeButton}>
              <Button
                circle
                colorScheme="negative"
                icon="close"
                aria-label="Close drawer"
                onClick={closeModal}
                size="large"
              />
            </Box> */}
            <Box>{children}</Box>
            {labelCloseModal && (
              <Box padding={3} width="full">
                <Button fluid onClick={closeModal}>
                  {labelCloseModal}
                </Button>
              </Box>
            )}
          </Box>
        )
      }}
    </ModalBase>
  )
}

export default FilterMobileDrawer
