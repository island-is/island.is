import React from 'react'
import { Button, ButtonTypes } from '../Button/Button'
import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { GridRow } from '../Grid/GridRow/GridRow'
import { GridColumn } from '../Grid/GridColumn/GridColumn'
import { ModalBase } from '../ModalBase/ModalBase'
import * as styles from './DialogPrompt.css'
import { Hidden } from '../Hidden/Hidden'

interface DialogPromptProps {
  /**
   * The heading text content
   */
  title: string
  /**
   * The paragraph text content
   */
  description?: string
  /**
   * Explain what this modal is for
   */
  ariaLabel: string
  /**
   * Unique ID for accessibility purposes
   */
  baseId: string
  /**
   * Element that opens the dialog.
   * It will be forwarded necessary props for a11y and event handling.
   */
  disclosureElement: React.ReactElement
  /**
   * User presses confirm callback
   */
  onConfirm?: () => void
  /**
   * User presses cancel callback
   */
  onCancel?: () => void
  /**
   * Show immediately without clicking the disclosure button
   */
  initialVisibility?: boolean | undefined
  /**
   * If left empty the button won't be rendered
   */
  buttonTextConfirm?: string
  /**
   * If left empty the button won't be rendered
   */
  buttonTextCancel?: string
  /**
   * Image to be displayed in the dialog
   */
  img?: React.ReactElement
  /**
   * Color and variant props that will be passed to the confirm button
   */
  buttonPropsConfirm?: ButtonTypes
  /**
   * Color and variant props that will be passed to the cancel button
   */
  buttonPropsCancel?: ButtonTypes
}

export const DialogPrompt = ({
  title,
  description,
  ariaLabel,
  baseId,
  disclosureElement,
  onConfirm,
  onCancel,
  buttonTextCancel,
  buttonTextConfirm,
  initialVisibility,
  img,
  buttonPropsConfirm = { variant: 'ghost', colorScheme: 'default' },
  buttonPropsCancel = { variant: 'ghost', colorScheme: 'default' },
}: DialogPromptProps) => {
  const hasButtons = !!buttonTextCancel || !!buttonTextConfirm

  return (
    <ModalBase
      disclosure={disclosureElement}
      baseId={baseId}
      aria-label={ariaLabel}
      initialVisibility={initialVisibility}
      className={styles.modal}
    >
      {({ closeModal }: { closeModal: () => void }) => {
        const handleClose = () => {
          onCancel && onCancel()
          closeModal()
        }
        const handleConfirm = () => {
          onConfirm && onConfirm()
          closeModal()
        }
        return (
          <Box
            background="white"
            paddingY={[3, 6, 12]}
            paddingX={[3, 6, 12, 15]}
          >
            <Box className={styles.closeButton}>
              <Button
                circle
                colorScheme="negative"
                icon="close"
                aria-label="Hætta við"
                onClick={() => {
                  closeModal()
                }}
                size="large"
              />
            </Box>
            <GridRow align="flexStart" alignItems="flexStart">
              <GridColumn span={img ? ['8/8', '5/8'] : '1/1'}>
                <Text variant="h2" as="h2" marginBottom={1}>
                  {title}
                </Text>
                {description && <Text paddingTop={2}>{description}</Text>}
              </GridColumn>

              {img && (
                <GridColumn span={['0', '3/8']}>
                  <Hidden below="sm">{img}</Hidden>
                </GridColumn>
              )}
              {hasButtons && (
                <GridColumn span="8/8">
                  <Box
                    marginTop={4}
                    display="flex"
                    flexDirection="row"
                    justifyContent={'spaceBetween'}
                  >
                    <Box paddingRight={2}>
                      {buttonTextCancel && (
                        <Button
                          {...buttonPropsCancel}
                          size="small"
                          onClick={handleClose}
                        >
                          {buttonTextCancel}
                        </Button>
                      )}
                    </Box>
                    <Box>
                      {buttonTextConfirm && (
                        <Button
                          {...buttonPropsConfirm}
                          size="small"
                          onClick={handleConfirm}
                        >
                          {buttonTextConfirm}
                        </Button>
                      )}
                    </Box>
                  </Box>
                </GridColumn>
              )}
            </GridRow>
          </Box>
        )
      }}
    </ModalBase>
  )
}

export default DialogPrompt
