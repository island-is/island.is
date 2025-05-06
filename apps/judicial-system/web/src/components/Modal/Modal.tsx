import { FC, isValidElement, PropsWithChildren, ReactNode } from 'react'
import ReactDOM from 'react-dom'
import FocusLock from 'react-focus-lock'
import { motion } from 'motion/react'

import { Box, Button, Icon, Text } from '@island.is/island-ui/core'

import * as styles from './Modal.css'

interface ModalProps {
  title: string
  text?: string | ReactNode
  primaryButtonText?: string
  secondaryButtonText?: string
  onClose?: () => void
  onSecondaryButtonClick?: () => void
  onPrimaryButtonClick?: () => void
  isPrimaryButtonLoading?: boolean
  isPrimaryButtonDisabled?: boolean
  primaryButtonColorScheme?: 'default' | 'destructive'
  isSecondaryButtonLoading?: boolean
  errorMessage?: string
  children?: ReactNode
  invertButtonColors?: boolean
  loading?: boolean
}

const Modal: FC<PropsWithChildren<ModalProps>> = ({
  title,
  text,
  primaryButtonText,
  secondaryButtonText,
  onClose,
  onSecondaryButtonClick,
  onPrimaryButtonClick,
  isPrimaryButtonLoading,
  isPrimaryButtonDisabled,
  primaryButtonColorScheme = 'default',
  isSecondaryButtonLoading,
  errorMessage,
  children,
  invertButtonColors,
  loading,
}: ModalProps) => {
  const modalVariants = {
    open: {
      translateY: 0,
      opacity: 1,
    },
    closed: {
      translateY: 50,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  }

  return (
    <FocusLock autoFocus={false}>
      <motion.div
        key="modal"
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        data-testid="modal"
      >
        <motion.div
          className={styles.modalContainer}
          initial="closed"
          animate="open"
          exit="closed"
          variants={modalVariants}
        >
          {onClose && (
            <Box position="absolute" top={0} right={0}>
              <button
                className={styles.closeButton}
                onClick={onClose}
                disabled={loading}
              >
                <Icon icon="close" type="outline" color="blue400" />
              </button>
            </Box>
          )}
          <Box marginBottom={3}>
            <Text variant="h1" as="h2">
              {title}
            </Text>
          </Box>
          {text && (
            <Box marginBottom={6} className={styles.breakSpaces}>
              {
                // Check if text is a string or Element
                isValidElement(text) ? text : <Text>{text}</Text>
              }
            </Box>
          )}
          {children}
          <Box display="flex">
            {secondaryButtonText && (
              <Box marginRight={3}>
                <Button
                  data-testid="modalSecondaryButton"
                  variant={invertButtonColors ? undefined : 'ghost'}
                  onClick={onSecondaryButtonClick}
                  loading={isSecondaryButtonLoading}
                  disabled={loading}
                >
                  {secondaryButtonText}
                </Button>
              </Box>
            )}
            {primaryButtonText && (
              <Button
                data-testid="modalPrimaryButton"
                variant={invertButtonColors ? 'ghost' : undefined}
                onClick={onPrimaryButtonClick}
                loading={isPrimaryButtonLoading}
                disabled={isPrimaryButtonDisabled}
                colorScheme={primaryButtonColorScheme}
              >
                {primaryButtonText}
              </Button>
            )}
          </Box>
          {errorMessage && (
            <Box marginTop={1} data-testid="modalErrorMessage">
              <Text variant="eyebrow" color="red600">
                {errorMessage}
              </Text>
            </Box>
          )}
        </motion.div>
      </motion.div>
    </FocusLock>
  )
}

const ModalPortal = ({
  title,
  text,
  primaryButtonText,
  secondaryButtonText,
  onClose,
  onSecondaryButtonClick,
  onPrimaryButtonClick,
  isPrimaryButtonLoading,
  isPrimaryButtonDisabled,
  primaryButtonColorScheme,
  isSecondaryButtonLoading,
  errorMessage,
  children,
  invertButtonColors,
  loading,
}: ModalProps) => {
  const modalRoot =
    document.getElementById('modal') ?? document.createElement('div')

  return ReactDOM.createPortal(
    <Modal
      title={title}
      text={text}
      primaryButtonText={primaryButtonText}
      secondaryButtonText={secondaryButtonText}
      onClose={onClose}
      onSecondaryButtonClick={onSecondaryButtonClick}
      onPrimaryButtonClick={onPrimaryButtonClick}
      isPrimaryButtonLoading={isPrimaryButtonLoading}
      isPrimaryButtonDisabled={isPrimaryButtonDisabled}
      primaryButtonColorScheme={primaryButtonColorScheme}
      isSecondaryButtonLoading={isSecondaryButtonLoading}
      errorMessage={errorMessage}
      children={children}
      invertButtonColors={invertButtonColors}
      loading={loading}
    />,
    modalRoot,
  )
}

export default ModalPortal
