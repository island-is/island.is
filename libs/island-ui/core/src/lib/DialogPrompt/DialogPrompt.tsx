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

import {
  useDialogState,
  Dialog,
  DialogDisclosure,
  DialogBackdrop,
  DialogProps,
} from 'reakit/Dialog'

import { GridContainer } from '../Grid/GridContainer/GridContainer'
import { GridRow } from '../Grid/GridRow/GridRow'
import { GridColumn } from '../Grid/GridColumn/GridColumn'

import * as styles from './DialogPrompt.treat'

interface DialogPromptProps {
  title: string
  description?: string
  ariaLabel: string
  baseId: string
  animated?: boolean
  disclosureElement?: ReactElement
  onConfirm?: () => void
  onClose?: () => void
  buttonTextConfirm?: string
  buttonTextCancel?: string
}

export const DialogPromptDiv = forwardRef(
  (props: DialogProps, ref: Ref<HTMLDivElement>) => {
    const [mounted, setMounted] = useState(false)
    useLayoutEffect(function () {
      setMounted(true)
    }, [])

    return mounted && <div className={styles.backdrop} {...props} ref={ref} />
  },
)

export const DialogPrompt = ({
  title,
  description,
  ariaLabel,
  animated = true,
  baseId,
  disclosureElement,
  onConfirm,
  onClose,
  buttonTextCancel = 'Cancel',
  buttonTextConfirm = 'Confirm',
}: DialogPromptProps) => {
  const initialFocusedRef = useRef(null)

  const dialog = useDialogState({
    animated,
    baseId,
  } as DialogProps)

  useEffect(() => {
    if (dialog.visible && initialFocusedRef.current) {
      initialFocusedRef.current.focus()
    }
  }, [dialog.visible, initialFocusedRef])

  const onCloseEvent = () => {
    onClose && onClose()
    dialog.hide()
  }

  return (
    <>
      <DialogDisclosure {...dialog} {...disclosureElement.props}>
        {(disclosureProps) =>
          React.cloneElement(disclosureElement, disclosureProps)
        }
      </DialogDisclosure>
      <DialogBackdrop {...dialog} as={DialogPromptDiv}>
        <Dialog
          role="dialog"
          {...dialog}
          aria-label={ariaLabel}
          className={styles.dialog}
        >
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
                onClick={onCloseEvent}
                className={styles.close}
                ref={initialFocusedRef}
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
              <GridRow>
                <GridColumn
                  span={['12/12', '12/12', '6/12', '4/12']}
                  paddingTop={[2, 3, 7]}
                >
                  <Button
                    size="default"
                    variant="ghost"
                    onClick={onCloseEvent}
                    fluid
                  >
                    {buttonTextCancel}
                  </Button>
                </GridColumn>
                <GridColumn
                  span={['12/12', '12/12', '6/12', '4/12']}
                  paddingTop={[2, 3, 7]}
                >
                  <Button
                    size="default"
                    onClick={() => {
                      onCloseEvent()
                      onConfirm && onConfirm()
                    }}
                    fluid
                  >
                    {buttonTextConfirm}
                  </Button>
                </GridColumn>
              </GridRow>
            </GridContainer>
          </Box>
        </Dialog>
      </DialogBackdrop>
    </>
  )
}

export default DialogPrompt
