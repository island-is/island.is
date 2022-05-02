import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text, Button, Divider } from '@island.is/island-ui/core'
import { DirectTaxPayment } from '@island.is/financial-aid/shared/lib'
import { summaryForm, directTaxPaymentModal } from '../../lib/messages'

interface Props {
  directTaxPayments: DirectTaxPayment[]
  hasFetchedPayments: boolean
  setIsModalOpen: (open: boolean) => void
}

const DirectTaxPaymentCell = ({
  directTaxPayments,
  hasFetchedPayments,
  setIsModalOpen,
}: Props) => {
  if (!hasFetchedPayments) {
    return null
  }

  const { formatMessage } = useIntl()

  return (
    <>
      <Divider />
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="flexStart"
        paddingY={[4, 4, 5]}
      >
        <Box marginRight={3}>
          <Text fontWeight="semiBold" color={'dark400'}>
            {formatMessage(summaryForm.directPayments.title)}
          </Text>
          <Text> {formatMessage(summaryForm.directPayments.fetched)}</Text>
        </Box>

        {directTaxPayments.length === 0 ? (
          <Text marginTop={3}>
            {formatMessage(directTaxPaymentModal.taxBreakdown.empty)}
          </Text>
        ) : (
          <Button
            onClick={() => setIsModalOpen(true)}
            icon="open"
            iconType="outline"
            variant="utility"
          >
            {formatMessage(summaryForm.directPayments.getBreakDown)}
          </Button>
        )}
      </Box>
    </>
  )
}

export default DirectTaxPaymentCell
