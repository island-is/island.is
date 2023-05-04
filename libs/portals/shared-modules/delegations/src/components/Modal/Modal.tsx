import React, { useRef } from 'react'
import {
  Box,
  Icon,
  ModalBase,
  Text,
  useBreakpoint,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import { RemoveScroll } from 'react-remove-scroll'
import * as styles from './Modal.css'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

export interface ModalProps {
  onClose?(): void

  id: string
  /**
   * Aria label for the modal
   */
  label: string
  /**
   * Displayed above the title
   */
  eyebrow?: string
  title?: string
  children?: React.ReactNode
  isVisible: boolean
  noPaddingBottom?: boolean
}

export const Modal = ({
  id,
  label,
  title,
  eyebrow,
  onClose,
  isVisible,
  children,
  noPaddingBottom = false,
}: ModalProps) => {
  const headingRef = useRef<HTMLElement>(null)
  const handleOnVisibilityChange = (isVisible: boolean) => {
    if (isVisible) {
      headingRef.current?.focus()
    } else {
      onClose?.()
    }
  }

  const { formatMessage } = useLocale()
  const { md } = useBreakpoint()

  return (
    <ModalBase
      baseId={id}
      modalLabel={label}
      className={styles.modal({ noPaddingBottom })}
      isVisible={isVisible}
      onVisibilityChange={handleOnVisibilityChange}
      hideOnClickOutside
      hideOnEsc
      preventBodyScroll={false} // Do to a bug in iOS we implement our own scroll lock
    >
      <Box className={styles.header} ref={headingRef}>
        <Box display="flex" flexDirection="column" rowGap={1}>
          {eyebrow ? <Text variant="eyebrow">{eyebrow}</Text> : null}
          {title ? (
            <Text as="h2" variant={md ? 'h2' : 'h3'}>
              {title}
            </Text>
          ) : null}
        </Box>

        <button onClick={onClose} className={styles.close}>
          <VisuallyHidden>{formatMessage(m.closeModal)}</VisuallyHidden>
          <Icon icon="close" type="outline" size="large" />
        </button>
      </Box>

      <RemoveScroll enabled={isVisible} forwardProps>
        <Box className={styles.content}>{children}</Box>
      </RemoveScroll>
    </ModalBase>
  )
}
