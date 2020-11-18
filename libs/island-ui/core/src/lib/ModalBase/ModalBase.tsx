import React, {
  FC,
  Ref,
  forwardRef,
  useState,
  useLayoutEffect,
  ReactElement,
  useEffect,
} from 'react'
import cn from 'classnames'
import {
  useDialogState,
  Dialog as BaseDialog,
  DialogBackdrop,
  DialogDisclosure,
  DialogProps,
} from 'reakit/Dialog'
import * as styles from './ModalBase.treat'

export const BackdropDiv = forwardRef(
  (props: DialogProps, ref: Ref<HTMLDivElement>) => {
    const [mounted, setMounted] = useState(false)
    useLayoutEffect(function () {
      setMounted(true)
    }, [])

    return mounted ? (
      <div className={styles.backdrop} {...props} ref={ref} />
    ) : null
  },
)

type ModalBaseProps = {
  /**
   * Element that opens the dialog.
   * It will be forwarded neccessery props for a11y and event handling.
   */
  disclosure?: ReactElement
  /**
   * Unique ID for accessibility purposes
   */
  baseId: string
  className?: string
  /**
   * Default visibility state
   */
  initialVisibility?: boolean
  /**
   * Setting this to false automatically closes the modal
   */
  toggleClose?: boolean
}

export const ModalBase: FC<ModalBaseProps> = ({
  disclosure,
  baseId,
  initialVisibility,
  toggleClose,
  children,
  className,
}) => {
  const modal = useDialogState({
    animated: true,
    baseId,
    visible: initialVisibility || false,
  })
  const closeModal = () => modal.hide()

  useEffect(() => {
    if (toggleClose) closeModal()
  }, [toggleClose])

  return (
    <>
      {disclosure ? (
        <DialogDisclosure {...modal} {...disclosure.props}>
          {(disclosureProps) => React.cloneElement(disclosure, disclosureProps)}
        </DialogDisclosure>
      ) : null}
      <DialogBackdrop {...modal} as={BackdropDiv}>
        <BaseDialog {...modal} className={cn(styles.modal, className)}>
          {typeof children === 'function' ? children({ closeModal }) : children}
        </BaseDialog>
      </DialogBackdrop>
    </>
  )
}
