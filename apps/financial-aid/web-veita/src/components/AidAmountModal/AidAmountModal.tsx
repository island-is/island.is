import React from 'react'
import { ModalBase, Text, Box, Button } from '@island.is/island-ui/core'

import * as styles from './AidAmountModal.css'

import format from 'date-fns/format'

import { calculateAidFinalAmount } from '@island.is/financial-aid/shared/lib'

interface Calculations {
  title: string
  calculation: string
}

interface Props {
  headline: string
  isVisible: boolean
  onVisibilityChange: React.Dispatch<React.SetStateAction<boolean>>
  calculations: Calculations[]
  finalAmount: string
}

const AidAmountModal = ({
  headline,
  isVisible,
  onVisibilityChange,
  calculations,
  finalAmount,
}: Props) => {
  const currentYear = format(new Date(), 'yyyy')

  const closeModal = (): void => {
    onVisibilityChange(false)
  }

  return (
    <ModalBase
      baseId="changeStatus"
      isVisible={isVisible}
      onVisibilityChange={(visibility) => {
        if (visibility !== isVisible) {
          onVisibilityChange(visibility)
        }
      }}
      className={styles.modalBase}
    >
      <Box onClick={closeModal} className={styles.modalContainer}>
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

          {calculations.map((item, index) => (
            <span key={'calculation-' + index}>
              <Box
                display="flex"
                justifyContent="spaceBetween"
                paddingY={2}
                paddingX={3}
                borderTopWidth="standard"
                borderColor="blue200"
              >
                <Text variant="small">{item.title}</Text>
                <Text>{item.calculation}</Text>
              </Box>
            </span>
          ))}

          <Box
            display="flex"
            justifyContent="spaceBetween"
            background="blue100"
            borderTopWidth="standard"
            borderBottomWidth="standard"
            borderColor="blue200"
            paddingY={2}
            paddingX={3}
            marginBottom={4}
          >
            <Text variant="small"> {headline} (hámark)</Text>
            <Text>{finalAmount}</Text>
          </Box>

          <Box display="flex" justifyContent="flexEnd" onClick={closeModal}>
            <Button>Loka</Button>
          </Box>
        </Box>
      </Box>
    </ModalBase>
  )
}

export default AidAmountModal
