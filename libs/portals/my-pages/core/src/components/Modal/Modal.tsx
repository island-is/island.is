import {
  Box,
  Button,
  ButtonProps,
  Hyphen,
  ModalBase,
  ResponsiveProp,
  Text,
} from '@island.is/island-ui/core'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import * as styles from './Modal.css'

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
  buttonsSpacing?:
    | ResponsiveProp<
        'center' | 'flexStart' | 'flexEnd' | 'spaceBetween' | 'spaceAround'
      >
    | undefined
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
  buttonsSpacing,
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
            borderRadius="standard"
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
                  <Text variant="h3" marginBottom={1}>
                    <Hyphen>{title}</Hyphen>
                  </Text>
                )}
                {text && <Text>{text}</Text>}
              </Box>
              {children}
              {buttons && (
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent={buttonsSpacing ?? 'flexStart'}
                  columnGap={2}
                  marginTop={4}
                >
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
                </Box>
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
