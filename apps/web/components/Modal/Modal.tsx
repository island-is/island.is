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
  ButtonDeprecated as Button,
  Box,
  Stack,
  Text,
  Icon,
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
}) => {
  const initialFocusedRef = useRef(null)
  const { colorScheme } = useContext(ColorSchemeContext)

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
      {!!disclosure && (
        <DialogDisclosure {...dialog} {...disclosure.props}>
          {(disclosureProps) => React.cloneElement(disclosure, disclosureProps)}
        </DialogDisclosure>
      )}
      <ColorSchemeContext.Provider value={{ colorScheme: 'blue' }}>
        <DialogBackdrop {...dialog} as={ModalDiv}>
          <Dialog
            {...dialog}
            role={role}
            aria-label={label}
            className={styles.dialog}
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
              <button onClick={onCloseEvent} className={styles.close}>
                <Icon type="close" color="blue400" width="18" height="18" />
              </button>
              <Stack space={3}>
                {!!title && (
                  <Text variant="h2" as="h3">
                    {title}
                  </Text>
                )}
                {children ?? null}
                <Box marginTop={6} className={styles.buttons}>
                  <Button
                    ref={initialFocusedRef}
                    width="fixed"
                    variant="ghost"
                    onClick={onCloseEvent}
                  >
                    {buttonTextCancel}
                  </Button>
                  <Button
                    width="fixed"
                    onClick={() => {
                      onCloseEvent()
                      onConfirm && onConfirm()
                    }}
                  >
                    {buttonTextConfirm}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Dialog>
        </DialogBackdrop>
      </ColorSchemeContext.Provider>
    </>
  )
}

export default Modal
