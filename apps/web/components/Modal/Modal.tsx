import React, {
  FC,
  forwardRef,
  ReactElement,
  Ref,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  Button,
  Box,
  Stack,
  Text,
  GridRow,
  GridColumn,
  ColorSchemeContext,
} from '@island.is/island-ui/core'
import {
  useDialogState,
  Dialog,
  DialogDisclosure,
  DialogBackdrop,
  DialogProps,
} from 'reakit/Dialog'

import * as styles from './Modal.treat'

interface ModalProps {
  title?: string
  label?: string
  baseId: string
  animated?: boolean
  role?: 'dialog' | 'alertdialog'
  disclosure?: ReactElement
  onConfirm?: () => void
  onClose?: () => void
  buttonTextConfirm?: string
  buttonTextCancel?: string
  lang?: string
}

export const ModalDiv = forwardRef(
  (props: DialogProps, ref: Ref<HTMLDivElement>) => {
    const [mounted, setMounted] = useState(false)

    useLayoutEffect(function () {
      setMounted(true)
    }, [])

    return mounted && <div className={styles.backdrop} {...props} ref={ref} />
  },
)

export const Modal: FC<ModalProps> = ({
  title,
  label,
  animated = true,
  baseId,
  children,
  role = 'alertdialog',
  disclosure,
  onConfirm,
  onClose,
  buttonTextCancel = 'Cancel',
  buttonTextConfirm = 'Confirm',
  lang,
}) => {
  const initialFocusedRef = useRef(null)
  const { colorScheme } = useContext(ColorSchemeContext)

  const dialog = useDialogState({
    animated,
    baseId,
  } as DialogProps)

  const langProp = lang
    ? {
        lang: lang,
      }
    : {}

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
      {!!disclosure && (
        <DialogDisclosure {...dialog} {...disclosure.props}>
          {(disclosureProps) => React.cloneElement(disclosure, disclosureProps)}
        </DialogDisclosure>
      )}
      {dialog.visible && (
        <ColorSchemeContext.Provider value={{ colorScheme: 'blue' }}>
          <DialogBackdrop {...dialog} as={ModalDiv}>
            <Dialog
              {...dialog}
              role={role}
              aria-label={label}
              className={styles.dialog}
              aria-modal="true"
              {...langProp}
            >
              <Box
                position="relative"
                width="full"
                marginX={3}
                paddingX={[3, 6, 6, 15]}
                paddingY={[6, 6, 6, 10]}
                borderRadius="large"
                className={styles.content}
              >
                <Box className={styles.close}>
                  <Button
                    circle
                    colorScheme="negative"
                    icon="close"
                    onClick={onCloseEvent}
                    size="large"
                  />
                </Box>

                <Stack space={3}>
                  {!!title && (
                    <Text variant="h2" as="h3">
                      {title}
                    </Text>
                  )}
                  {children ?? null}
                  <GridRow>
                    <GridColumn
                      span={['12/12', '6/12', '6/12']}
                      paddingBottom={[2, 0, 0]}
                    >
                      <Button
                        ref={initialFocusedRef}
                        size="large"
                        fluid
                        variant="ghost"
                        onClick={onCloseEvent}
                      >
                        {buttonTextCancel}
                      </Button>
                    </GridColumn>
                    <GridColumn span={['12/12', '6/12', '6/12']}>
                      <Button
                        size="large"
                        fluid
                        onClick={() => {
                          onCloseEvent()
                          onConfirm && onConfirm()
                        }}
                      >
                        {buttonTextConfirm}
                      </Button>
                    </GridColumn>
                  </GridRow>
                </Stack>
              </Box>
            </Dialog>
          </DialogBackdrop>
        </ColorSchemeContext.Provider>
      )}
    </>
  )
}

export default Modal
