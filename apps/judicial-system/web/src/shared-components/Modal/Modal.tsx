import { Box, Button, Icon, Text } from '@island.is/island-ui/core'
import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom'
import { motion } from 'framer-motion'

import * as styles from './Modal.css'

interface ModalProps {
  title: string
  text: string | ReactNode
  primaryButtonText: string
  secondaryButtonText?: string
  handleClose?: () => void
  handleSecondaryButtonClick?: () => void
  handlePrimaryButtonClick?: () => void
  isPrimaryButtonLoading?: boolean
}

const Modal: React.FC<ModalProps> = ({
  title,
  text,
  primaryButtonText,
  secondaryButtonText,
  handleClose,
  handleSecondaryButtonClick,
  handlePrimaryButtonClick,
  isPrimaryButtonLoading,
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
    <motion.div
      key="modal"
      className={styles.container}
      data-testid="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={styles.modalContainer}
        initial="closed"
        animate="open"
        exit="closed"
        variants={modalVariants}
      >
        {handleClose && (
          <Box position="absolute" top={0} right={0}>
            <button className={styles.closeButton} onClick={handleClose}>
              <Icon icon="close" type="outline" color="blue400" />
            </button>
          </Box>
        )}
        <Box marginBottom={3}>
          <Text variant="h1">{title}</Text>
        </Box>
        <Box marginBottom={6} className={styles.breakSpaces}>
          {
            // Check if text is a string or Element
            React.isValidElement(text) ? text : <Text>{text}</Text>
          }
        </Box>
        <Box display="flex">
          {secondaryButtonText && (
            <Box marginRight={3}>
              <Button
                data-testid="modalSecondaryButton"
                variant="ghost"
                onClick={handleSecondaryButtonClick}
              >
                {secondaryButtonText}
              </Button>
            </Box>
          )}
          {primaryButtonText !== '' && (
            <Button
              data-testid="modalPrimaryButton"
              onClick={handlePrimaryButtonClick}
              loading={isPrimaryButtonLoading}
            >
              {primaryButtonText}
            </Button>
          )}
        </Box>
      </motion.div>
    </motion.div>
  )
}

const ModalPortal = ({
  title,
  text,
  primaryButtonText,
  secondaryButtonText,
  handleClose,
  handleSecondaryButtonClick,
  handlePrimaryButtonClick,
  isPrimaryButtonLoading,
}: ModalProps) => {
  const modalRoot =
    document.getElementById('modal') ?? document.createElement('div')

  return ReactDOM.createPortal(
    <Modal
      title={title}
      text={text}
      primaryButtonText={primaryButtonText}
      secondaryButtonText={secondaryButtonText}
      handleClose={handleClose}
      handleSecondaryButtonClick={handleSecondaryButtonClick}
      handlePrimaryButtonClick={handlePrimaryButtonClick}
      isPrimaryButtonLoading={isPrimaryButtonLoading}
    />,
    modalRoot,
  )
}

export default ModalPortal
