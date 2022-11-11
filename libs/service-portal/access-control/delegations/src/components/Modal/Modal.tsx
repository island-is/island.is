import React from 'react'
import { Box, Icon, ModalBase, Text } from '@island.is/island-ui/core'
import * as styles from './Modal.css'

export interface ModalProps {
  onClose?(): void
  id: string
  label?: string
  title?: string
  children?: React.ReactNode
  isVisible: boolean
  noPaddingBottom?: boolean
}

export const Modal = ({
  id,
  title,
  label,
  onClose,
  isVisible,
  children,
  noPaddingBottom,
}: ModalProps) => {
  const handleOnVisibilityChange = (isVisible: boolean) => {
    !isVisible && onClose?.()
  }

  return (
    <ModalBase
      baseId={id}
      isVisible={isVisible}
      className={styles.modal}
      hideOnClickOutside
      hideOnEsc
      preventBodyScroll
      removeOnClose
      onVisibilityChange={handleOnVisibilityChange}
    >
      <Box
        position="relative"
        background="white"
        paddingX={[3, 3, 6]}
        paddingBottom={noPaddingBottom ? 0 : [3, 3, 6]}
        paddingTop={12}
        borderRadius="standard"
        width="full"
        overflow="auto"
        className={styles.modalInner}
      >
        <Box position="absolute" top={4} right={4}>
          <button onClick={onClose}>
            <Icon icon="close" type="outline" />
          </button>
        </Box>
        <Box display="flex" flexDirection="column" rowGap={2}>
          {label && (
            <Text variant="small" fontWeight="semiBold">
              {label}
            </Text>
          )}
          {title && <Text variant="h2">{title}</Text>}
        </Box>
        {children}
      </Box>
    </ModalBase>
  )
}
