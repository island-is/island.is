import React from 'react'
import { ModalBase, Text, Box, Button } from '@island.is/island-ui/core'

import * as styles from './AidAmountModal.css'

import * as modalStyles from '../StateModal/StateModal.css'

import { Calculations } from '@island.is/financial-aid/shared/lib'

import { Breakdown } from '@island.is/financial-aid/shared/components'

interface Props {
  headline: string
  isVisible: boolean
  onVisibilityChange: React.Dispatch<React.SetStateAction<boolean>>
  calculations: Calculations[]
}

const AidAmountModal = ({
  headline,
  isVisible,
  onVisibilityChange,
  calculations,
}: Props) => {
  const closeModal = () => {
    onVisibilityChange(false)
  }

  return (
    <ModalBase
      baseId="changeAidAmount"
      modalLabel="Change aid amount modal"
      isVisible={isVisible}
      onVisibilityChange={(visibility) => {
        if (visibility !== isVisible) {
          onVisibilityChange(visibility)
        }
      }}
      className={modalStyles.modalBase}
    >
      <Box
        className={modalStyles.closeModalBackground}
        onClick={closeModal}
      ></Box>

      <Box className={modalStyles.modalContainer}>
        <Box
          position="relative"
          borderRadius="large"
          overflow="hidden"
          background="white"
          className={styles.modal}
        >
          <Text variant="h3" marginBottom={4}>
            {headline}
          </Text>

          <Breakdown calculations={calculations} />

          <Box display="flex" justifyContent="flexEnd" marginTop={4}>
            <Button onClick={closeModal}>Loka</Button>
          </Box>
        </Box>
      </Box>
    </ModalBase>
  )
}

export default AidAmountModal
