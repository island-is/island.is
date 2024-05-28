import React from 'react'
import { ModalBase, Text, Box, Button } from '@island.is/island-ui/core'

import * as styles from './AidAmountModal.css'

import * as modalStyles from '../StateModal/StateModal.css'

import { Calculations, getMonth } from '@island.is/financial-aid/shared/lib'

import { Breakdown } from '@island.is/financial-aid/shared/components'

interface Props {
  headline: string
  isVisible: boolean
  onVisibilityChange: React.Dispatch<React.SetStateAction<boolean>>
  appliedDate: string
}

const AppliedMonthModal = ({
  headline,
  isVisible,
  onVisibilityChange,
  appliedDate,
}: Props) => {
  const closeModal = (): void => {
    onVisibilityChange(false)
  }

  const getMonth = new Date(appliedDate).getMonth()

  // console.log(
  //   new Date(appliedDate).getMonth(),
  //   new Date(appliedDate).getMonth() - 1,
  //   new Date(appliedDate).getMonth() - 2,
  // )

  return (
    <ModalBase
      baseId="changeStatus"
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
          <Box paddingLeft={4} paddingY={2} background="blue400">
            <Text fontWeight="semiBold" color="white">
              {headline}
            </Text>
          </Box>

          <Box padding={4}>
            <Box display="flex" justifyContent="flexEnd" marginTop={4}>
              <Button onClick={closeModal}>Loka</Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </ModalBase>
  )
}

export default AppliedMonthModal
