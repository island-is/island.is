import { FishingLicenseUnfulfilledLicense } from '@island.is/api/schema'
import {
  Box,
  Text,
  Stack,
  ModalBase,
  BulletList,
  Bullet,
  Button,
} from '@island.is/island-ui/core'
import React, { FC, useState } from 'react'
import AnimateHeight from 'react-animate-height'
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
  console.log(unfulfilledLicenses)
  if (!unfulfilledLicenses) return null
  console.log('hello')
  return (
    <ModalBase
      baseId="ship-selection-alert-modal"
      isVisible={visibility}
      className={`${styles.dialog} ${styles.background} ${styles.center}`}
      onVisibilityChange={(visibility) => setVisibility(visibility)}
    >
      <Box background="white" padding={10}>
        {unfulfilledLicenses.map((license, index) => (
          <UnfulfilledLicenseReasons
            unfulfilledLicense={license}
            key={`unfulfilled-license-${index}`}
          />
        ))}
      </Box>
    </ModalBase>
  )
}
