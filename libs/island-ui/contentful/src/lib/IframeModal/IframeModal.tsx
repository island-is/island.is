import React, {
  FC,
  forwardRef,
  ReactElement,
  Ref,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from 'react'
import { Box, Icon, Text } from '@island.is/island-ui/core'
import {
  useDialogState,
  Dialog,
  DialogDisclosure,
  DialogBackdrop,
  DialogProps,
} from 'reakit/Dialog'

import * as styles from './IframeModal.css'

interface IframeModalProps {
  title?: string
  label?: string
  closeWindowLabel?: string
  baseId: string
  src: string
  animated?: boolean
  disclosure?: ReactElement
}

export const IframeModalDiv = forwardRef(
  (props: DialogProps, ref: Ref<HTMLDivElement>) => {
    const [mounted, setMounted] = useState(false)

    useLayoutEffect(() => {
      setMounted(true)
    }, [])

    return mounted && <div className={styles.backdrop} {...props} ref={ref} />
  },
)

export const IframeModal: FC<React.PropsWithChildren<IframeModalProps>> = ({
  title,
  label,
  closeWindowLabel = 'Loka glugga',
  animated = true,
  baseId,
  src,
  disclosure,
}) => {
  const initialFocusedRef = useRef(null)

  const dialog = useDialogState({
    animated,
    baseId,
  } as DialogProps)

  useEffect(() => {
    if (dialog.visible && initialFocusedRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      initialFocusedRef.current.focus()
    }
  }, [dialog.visible, initialFocusedRef])

  return (
    <>
      {!!disclosure && (
        <DialogDisclosure {...dialog} {...disclosure.props}>
          {(disclosureProps: any) =>
            React.cloneElement(disclosure, disclosureProps)
          }
        </DialogDisclosure>
      )}
      <DialogBackdrop {...dialog} as={IframeModalDiv}>
        <Dialog
          {...dialog}
          role="dialog"
          aria-label={label}
          className={styles.dialog}
        >
          <Box
            display="flex"
            marginLeft={2}
            width="full"
            alignItems="center"
            className={styles.head}
          >
            <div className={styles.heading} title={title}>
              <Text truncate variant="h3" as="h1">
                {title}
              </Text>
            </div>
            <button
              onClick={dialog.hide}
              className={styles.close}
              aria-label={closeWindowLabel}
            >
              <Icon size="large" color="blue400" icon="closeCircle" />
            </button>
          </Box>
          <iframe ref={initialFocusedRef} className={styles.iframe} src={src} />
        </Dialog>
      </DialogBackdrop>
    </>
  )
}

export default IframeModal
