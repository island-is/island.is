import React, { FC, useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Modal } from '@island.is/service-portal/core'
import {
  Text,
  Button,
  Box,
  GridColumn,
  GridRow,
  Hidden,
  LoadingDots,
  ModalBase,
} from '@island.is/island-ui/core'
import { msg } from '../../../../lib/messages'
import * as styles from './LoadModal.css'

export const LoadModal = () => {
  return (
    <ModalBase
      baseId="loading-onboarding-modal"
      hideOnClickOutside={false}
      initialVisibility={true}
      className={styles.dialog}
      modalLabel="Loading modal"
      backdropWhite={false}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="full"
      >
        <LoadingDots large />
      </Box>
    </ModalBase>
  )
}
