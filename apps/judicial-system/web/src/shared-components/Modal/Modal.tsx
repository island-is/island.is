import { Box, Button, Icon, Typography } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import React from 'react'
import ReactDOM from 'react-dom'

import * as styles from './Modal.treat'

interface ModalProps {
  handleClose?: () => void
  handleSecondaryButtonClick?: () => void
  handlePrimaryButtonClick?: () => void
  isPrimaryButtonLoading?: boolean
}

const Modal: React.FC<ModalProps> = ({
  handleClose,
  handleSecondaryButtonClick,
  handlePrimaryButtonClick,
  isPrimaryButtonLoading,
}: ModalProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.modalContainer}>
        <Box position="absolute" top={0} right={0}>
          <button className={styles.closeButton} onClick={handleClose}>
            <Icon type="close" />
          </button>
        </Box>
        <Box marginBottom={4}>
          <Typography variant="h1">Viltu senda tilkynningu?</Typography>
        </Box>
        <Box marginBottom={6}>
          <Typography>
            Með því að senda tilkynningu á dómara á vakt um að krafa um
            gæsluvarðhald sé í vinnslu flýtir það fyrir málsmeðferð og allir
            aðilar eru upplýstir um stöðu mála.
          </Typography>
        </Box>
        <Box display="flex">
          <Box marginRight={3}>
            <Button onClick={handleSecondaryButtonClick} variant="ghost">
              Halda áfram með kröfu
            </Button>
          </Box>
          <Button
            onClick={handlePrimaryButtonClick}
            icon={isPrimaryButtonLoading ? 'loading' : null}
            loading={isPrimaryButtonLoading}
          >
            Senda tilkynningu
          </Button>
        </Box>
      </div>
    </div>
  )
}

const ModalPortal = ({
  handleClose,
  handleSecondaryButtonClick,
  handlePrimaryButtonClick,
  isPrimaryButtonLoading,
}: ModalProps) => {
  return ReactDOM.createPortal(
    <Modal
      handleClose={handleClose}
      handleSecondaryButtonClick={handleSecondaryButtonClick}
      handlePrimaryButtonClick={handlePrimaryButtonClick}
      isPrimaryButtonLoading={isPrimaryButtonLoading}
    />,
    document.getElementById('modal'),
  )
}

export default ModalPortal
