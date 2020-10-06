import { Box, Button, Icon, Typography } from '@island.is/island-ui/core'
import React from 'react'
import ReactDOM from 'react-dom'

import * as styles from './Modal.treat'

interface ModalProps {
  title: string
  text: string | JSX.Element
  primaryButtonText: string
  handleClose?: () => void
  handleSecondaryButtonClick?: () => void
  handlePrimaryButtonClick?: () => void
  isPrimaryButtonLoading?: boolean
}

const Modal: React.FC<ModalProps> = ({
  title,
  text,
  primaryButtonText,
  handleClose,
  handleSecondaryButtonClick,
  handlePrimaryButtonClick,
  isPrimaryButtonLoading,
}: ModalProps) => {
  return (
    <div className={styles.container} test-id="modal">
      <div className={styles.modalContainer}>
        {handleClose && (
          <Box position="absolute" top={0} right={0}>
            <button className={styles.closeButton} onClick={handleClose}>
              <Icon type="close" />
            </button>
          </Box>
        )}
        <Box marginBottom={4}>
          <Typography variant="h1">{title}</Typography>
        </Box>
        <Box marginBottom={6}>
          {
            // Check if text is a string or Element
            React.isValidElement(text) ? text : <Typography>{text}</Typography>
          }
        </Box>
        <Box display="flex">
          {handleSecondaryButtonClick && (
            <Box marginRight={3}>
              <Button onClick={handleSecondaryButtonClick} variant="ghost">
                Halda áfram með kröfu
              </Button>
            </Box>
          )}
          {primaryButtonText && (
            <Button
              onClick={handlePrimaryButtonClick}
              icon={isPrimaryButtonLoading ? 'loading' : null}
              loading={isPrimaryButtonLoading}
            >
              {primaryButtonText}
            </Button>
          )}
        </Box>
      </div>
    </div>
  )
}

const ModalPortal = ({
  title,
  text,
  primaryButtonText,
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
      handleClose={handleClose}
      handleSecondaryButtonClick={handleSecondaryButtonClick}
      handlePrimaryButtonClick={handlePrimaryButtonClick}
      isPrimaryButtonLoading={isPrimaryButtonLoading}
    />,
    modalRoot,
  )
}

export default ModalPortal
