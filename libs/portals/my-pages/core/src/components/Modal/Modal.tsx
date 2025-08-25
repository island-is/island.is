import React, { FC, ReactElement, useEffect, useState } from 'react'
import * as styles from './Modal.css'
import {
  Box,
  ModalBase,
  Button,
  ButtonProps,
  Text,
  Inline,
} from '@island.is/island-ui/core'

interface Props {
  id: string
  onCloseModal?: () => void
  toggleClose?: boolean
  isVisible?: boolean
  initialVisibility?: boolean
  disclosure?: ReactElement
  label?: string
  title?: string
  text?: string
  buttons?: Array<{
    id: ButtonProps['id']
    type?: 'ghost' | 'primary' | 'utility'
    onClick?: () => void
    text?: string
    loading?: boolean
  }>
  iconSrc?: string
  iconAlt?: string
  /**
   * No styling. All callbacks available.
   */
  skeleton?: boolean
}

export const Modal: FC<React.PropsWithChildren<Props>> = ({
  id,
  children,
  toggleClose,
  onCloseModal,
  disclosure,
  isVisible,
  label,
  title,
  text,
  buttons,
  initialVisibility = true,
  skeleton,
  iconAlt,
  iconSrc,
}) => {
  const [closing, setClosing] = useState(false)
  const [startClosing, setStartClosing] = useState(false)

  useEffect(() => {
    if (closing) {
      onCloseModal?.()
      setClosing(false)
      setStartClosing(false)
    }
  }, [closing, onCloseModal])

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    if (startClosing) {
      timeout = setTimeout(() => {
        setClosing(true)
      }, 500)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [startClosing])

  const handleOnVisibilityChange = (isVisible: boolean) => {
    !isVisible && onCloseModal && setStartClosing(true)
  }

  return (
    <ModalBase
      baseId={id}
      initialVisibility={initialVisibility}
      className={styles.modal}
      toggleClose={toggleClose}
      onVisibilityChange={handleOnVisibilityChange}
      disclosure={disclosure}
      modalLabel={label}
      isVisible={isVisible}
      preventBodyScroll
    >
      {({ closeModal }: { closeModal: () => void }) =>
        skeleton ? (
          <Box background="white">{children}</Box>
        ) : (
          <Box
            background="white"
            display="flex"
            flexDirection="row"
            alignItems="center"
            rowGap={2}
            paddingY={[3, 6, 12]}
            paddingX={[3, 6, 12, 14]}
          >
            <Box className={styles.closeButton}>
              <Button
                circle
                colorScheme="negative"
                icon="close"
                onClick={() => {
                  closeModal()
                }}
                size="large"
              />
            </Box>
            <Box width="full">
              <Box marginBottom={6}>
                {title && (
                  <Text variant="h3" marginBottom={'auto'}>
                    {title}
                  </Text>
                )}
                {text && <Text>{text}</Text>}
              </Box>
              {children}
              {buttons && (
                <Inline space={2}>
                  {buttons.map((b) => (
                    <Button
                      key={b.id}
                      variant={b.type ?? 'primary'}
                      size="small"
                      onClick={b.onClick}
                      loading={b.loading}
                    >
                      {b.text}
                    </Button>
                  ))}
                </Inline>
              )}
            </Box>
            {iconSrc && (
              <Box marginLeft={6} className={styles.image}>
                <img src={iconSrc} alt={iconAlt || 'Modal icon'} />
              </Box>
            )}
          </Box>
        )
      }
    </ModalBase>
  )
}

export default Modal
