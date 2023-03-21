import {
  Text,
  Box,
  Icon,
  ModalBase,
  useBreakpoint,
} from '@island.is/island-ui/core'
import { ReactNode } from 'react'
import * as styles from './Modal.css'

export interface ModalProps {
  onClose?(): void
  id: string
  label?: string
  title?: string
  children?: ReactNode
  isVisible: boolean
}

export const Modal = ({
  id,
  onClose,
  isVisible,
  children,
  label,
  title,
}: ModalProps) => {
  const { md } = useBreakpoint()

  const handleOnVisibilityChange = (isVisible: boolean) => {
    if (!isVisible) {
      onClose?.()
    }
  }

  return (
    <ModalBase
      baseId={id}
      isVisible={isVisible}
      className={styles.modal}
      modalLabel={label}
      hideOnClickOutside
      hideOnEsc
      preventBodyScroll={md}
      onVisibilityChange={handleOnVisibilityChange}
    >
      <Box
        position="relative"
        background="white"
        paddingX={[3, 3, 6]}
        paddingBottom={[3, 3, 6]}
        paddingTop={12}
        borderRadius="standard"
        width="full"
        overflow="auto"
        className={styles.modalInner}
      >
        {title && (
          <Box display="flex" flexDirection="column" rowGap={2} tabIndex={-1}>
            {label && (
              <Text variant="small" fontWeight="semiBold">
                {label}
              </Text>
            )}
            {title && <Text variant="h2">{title}</Text>}
          </Box>
        )}
        {children}
        <Box position="absolute" top={4} right={4} aria-hidden>
          <button onClick={onClose}>
            <Icon icon="close" type="outline" size="large" />
          </button>
        </Box>
      </Box>
    </ModalBase>
  )
}
