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
  /**
   * If scrollType is 'inside' the modal won't overflow the viewport.
   * This is ideal if we have an action bar at the bottom of
   * the modal that we want to be always visible.
   * @default "outside"
   */
  scrollType?: 'inside' | 'outside'
  /**
   * A visually hidden label for the close button
   */
  closeButtonLabel: string
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
  scrollType = 'outside',
  closeButtonLabel = 'Close',
}: ModalProps) => {
  const headingRef = useRef<HTMLElement>(null)
  const handleOnVisibilityChange = (isVisible: boolean) => {
    if (isVisible) {
      headingRef.current?.focus()
    } else {
      onClose?.()
    }
  }

  const { md } = useBreakpoint()
  const isInsideScroll = scrollType === 'inside' || !md
  const isOutsideScroll = !isInsideScroll

  return (
    <RemoveScroll enabled={isVisible && isOutsideScroll}>
      <ModalBase
        baseId={id}
        modalLabel={label}
        className={styles.modal({ noPaddingBottom, scrollType })}
        isVisible={isVisible}
        onVisibilityChange={handleOnVisibilityChange}
        hideOnClickOutside
        hideOnEsc
        preventBodyScroll={false}
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
            <VisuallyHidden>{closeButtonLabel}</VisuallyHidden>
            <Icon color="blue400" icon="close" type="outline" size="large" />
          </button>
        </Box>

        <RemoveScroll enabled={isVisible && isInsideScroll} forwardProps>
          <Box className={styles.content({ scrollType })}>{children}</Box>
        </RemoveScroll>
      </ModalBase>
    </RemoveScroll>
  )
}
