import React, {
  FC,
  Ref,
  forwardRef,
  useState,
  useLayoutEffect,
  ReactElement,
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

    return mounted && <div className={styles.backdrop} {...props} ref={ref} />
  },
)

type ModalBaseProps = {
  disclosure: ReactElement
  baseId: string
  className?: string
}

export const ModalBase: FC<ModalBaseProps> = ({
  disclosure,
  baseId,
  children,
  className,
}) => {
  const modal = useDialogState({ animated: true, baseId })
  const closeModal = () => modal.hide()
  return (
    <>
      <DialogDisclosure {...modal} {...disclosure.props}>
        {(disclosureProps) => React.cloneElement(disclosure, disclosureProps)}
      </DialogDisclosure>
      <DialogBackdrop {...modal} as={BackdropDiv}>
        <BaseDialog {...modal} className={cn(styles.modal, className)}>
          {typeof children === 'function' ? children({ closeModal }) : children}
        </BaseDialog>
      </DialogBackdrop>
    </>
  )
}
