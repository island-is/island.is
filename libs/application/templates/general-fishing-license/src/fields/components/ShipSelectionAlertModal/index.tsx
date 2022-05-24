import { FishingLicenseUnfulfilledLicense } from '@island.is/api/schema'
import { Box, Text, ModalBase, Icon } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { shipSelection } from '../../../lib/messages'
import * as styles from './ShipSelectionAlertModal.css'
import { UnfulfilledLicenseReasons } from './UnfulfilledLicenseReasons'

interface ShipSelectionAlertModalProps {
  visibility: boolean
  setVisibility: (visibility: boolean) => void
  unfulfilledLicenses: FishingLicenseUnfulfilledLicense[] | null
}

export const ShipSelectionAlertModal: FC<ShipSelectionAlertModalProps> = ({
  visibility,
  setVisibility,
  unfulfilledLicenses,
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
        {unfulfilledLicenses?.map((license, index) => (
          <UnfulfilledLicenseReasons
            unfulfilledLicense={license}
            key={`unfulfilled-license-${index}`}
          />
        ))}
      </Box>
    </ModalBase>
  )
}
