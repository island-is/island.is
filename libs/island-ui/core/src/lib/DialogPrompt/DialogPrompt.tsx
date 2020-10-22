import React, {
  forwardRef,
  ReactElement,
  Ref,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { FocusableBox } from '../FocusableBox/FocusableBox'
import { Button } from '../Button/Button'
import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { Icon } from '../IconRC/Icon'

import { GridContainer } from '../Grid/GridContainer/GridContainer'
import { GridRow } from '../Grid/GridRow/GridRow'
import { GridColumn } from '../Grid/GridColumn/GridColumn'
import { ModalBase } from '../ModalBase/ModalBase'

import * as styles from './DialogPrompt.treat'

interface DialogPromptProps {
  title: string
  description?: string
  ariaLabel: string
  baseId: string
  disclosureElement?: ReactElement
  onConfirm?: () => void
  onCancel?: () => void
  buttonTextConfirm?: string
  buttonTextCancel?: string
}

export const DialogPrompt = ({
  title,
  description,
  ariaLabel,
  baseId,
  disclosureElement,
  onConfirm,
  onCancel,
  buttonTextCancel = 'Cancel',
  buttonTextConfirm = 'Confirm',
}: DialogPromptProps) => (
  <ModalBase
    disclosure={disclosureElement}
    baseId={baseId}
    aria-label={ariaLabel}
    className={styles.dialog}
  >
    {({ closeModal }) => {
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
          position="relative"
          width="full"
          marginX={3}
          paddingX={[3, 4, 4, 8]}
          paddingY={[6, 6, 6, 12]}
          borderRadius="large"
          background="white"
          className={styles.content}
        >
          <GridContainer position="none">
            <FocusableBox
              component="button"
              onClick={handleClose}
              className={styles.close}
            >
              <Icon icon="close" color="blue400" size="medium" />
            </FocusableBox>
            <Text variant="h2" as="h3" paddingBottom={2}>
              {title}
            </Text>
            {description && (
              <Text variant="intro" paddingBottom={2}>
                {description}
              </Text>
            )}
            <GridRow align="spaceBetween">
              <GridColumn
                span={['12/12', '12/12', '1/3']}
                paddingTop={[2, 2, 7]}
              >
                <Button
                  size="default"
                  variant="ghost"
                  onClick={handleClose}
                  fluid
                >
                  {buttonTextCancel}
                </Button>
              </GridColumn>
              <GridColumn
                span={['12/12', '12/12', '1/3']}
                paddingTop={[2, 2, 7]}
              >
                <Button size="default" onClick={handleConfirm} fluid>
                  {buttonTextConfirm}
                </Button>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      )
    }}
  </ModalBase>
)

export default DialogPrompt
