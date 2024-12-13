import React from 'react'
import { useIntl } from 'react-intl'
import { ModalBase, Text, Box, Button } from '@island.is/island-ui/core'

import { DirectTaxPayment } from '@island.is/financial-aid/shared/lib'
import { TaxBreakdown } from '..'
import { directTaxPaymentModal } from '../../lib/messages'

import * as styles from './DirectTaxPaymentModal.css'

interface Props {
  isVisible: boolean
  onVisibilityChange: (isOpen: boolean) => void
  items: DirectTaxPayment[]
  dateDataWasFetched: string
}

const DirectTaxPaymentModal = ({
  isVisible,
  onVisibilityChange,
  items,
  dateDataWasFetched,
}: Props) => {
  const { formatMessage } = useIntl()

  return (
    <ModalBase
      baseId="directTaxPaymentModal"
      className={styles.modalBase}
      isVisible={isVisible}
      onVisibilityChange={(visibility) => {
        if (visibility !== isVisible) {
          onVisibilityChange(visibility)
        }
      }}
    >
      {({ closeModal }) => (
        <Box onClick={closeModal} className={styles.container}>
          <Box
            position="relative"
            background="white"
            borderRadius="large"
            paddingY={4}
            paddingX={4}
            className={styles.modal}
          >
            <Text variant="h3" marginBottom={4}>
              {formatMessage(directTaxPaymentModal.general.headline)}
            </Text>

            <TaxBreakdown
              items={items}
              dateDataWasFetched={dateDataWasFetched}
            />

            <Box paddingTop={4} display="flex" justifyContent="flexEnd">
              <Button onClick={closeModal}>
                {formatMessage(directTaxPaymentModal.general.close)}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </ModalBase>
  )
}

export default DirectTaxPaymentModal
