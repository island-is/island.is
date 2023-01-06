import { Box, Text, ModalBase, Icon } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { shipSelection } from '../../../lib/messages'
import * as styles from './ShipSelectionAlertModal.css'

interface ShipSelectionAlertModalProps {
  visibility: boolean
  setVisibility: (visibility: boolean) => void
}

export const ShipSelectionAlertModal: FC<ShipSelectionAlertModalProps> = ({
  visibility,
  setVisibility,
}) => {
  const { formatMessage } = useLocale()
  const closeModal = () => {
    setVisibility(false)
  }
  return (
    <ModalBase
      baseId="ship-selection-alert-modal"
      isVisible={visibility}
      className={`${styles.dialog} ${styles.background} ${styles.center}`}
      onVisibilityChange={(visibility) => setVisibility(visibility)}
    >
      <Box background="white" padding={10}>
        <Box
          className={styles.close}
          onClick={closeModal}
          role="button"
          aria-label="close button"
        >
          <Icon icon="close" size="large" />
        </Box>
        <Text variant="h3">
          {formatMessage(shipSelection.labels.unfulfilledLicensesModalTitle)}
        </Text>
      </Box>
    </ModalBase>
  )
}
