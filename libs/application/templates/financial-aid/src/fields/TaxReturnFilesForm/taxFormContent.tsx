import React from 'react'
import { useIntl } from 'react-intl'
import { Text, Box } from '@island.is/island-ui/core'
import { taxReturnForm } from '../../lib/messages'
import { DescriptionText } from '..'

const DirectTaxPaymentsInfo = () => {
  const { formatMessage } = useIntl()
  return (
    <>
      <Text as="h2" variant="h3" marginBottom={2}>
        {formatMessage(taxReturnForm.instructions.findDirectTaxPaymentsTitle)}
      </Text>

      <Text>
        {formatMessage(taxReturnForm.instructions.findDirectTaxPayments)}
      </Text>
    </>
  )
}

const TaxReturnInfo = () => {
  const { formatMessage } = useIntl()
  return (
    <>
      <Text as="h2" variant="h3" marginBottom={2}>
        {formatMessage(taxReturnForm.instructions.findTaxReturnTitle)}
      </Text>
      <DescriptionText text={taxReturnForm.instructions.findTaxReturn} />
    </>
  )
}

export const getTaxFormContent = (
  taxReturnFailed: boolean,
  directTaxPaymentsFailed: boolean,
) => {
  switch (true) {
    case taxReturnFailed && !directTaxPaymentsFailed:
      return {
        data: (
          <Box marginBottom={[4, 4, 5]}>
            <DescriptionText
              text={taxReturnForm.data.directTaxPaymentsFailed}
            />
          </Box>
        ),
        info: <TaxReturnInfo />,
      }
    case directTaxPaymentsFailed && !taxReturnFailed:
      return {
        data: (
          <Box marginBottom={[4, 4, 5]} marginTop={2}>
            <DescriptionText text={taxReturnForm.data.taxReturnFailed} />
          </Box>
        ),
        info: <DirectTaxPaymentsInfo />,
      }

    default:
      return {
        data: (
          <Box marginBottom={[4, 4, 5]} marginTop={2}>
            <DescriptionText text={taxReturnForm.general.description} />
          </Box>
        ),
        info: (
          <>
            <TaxReturnInfo />
            <DirectTaxPaymentsInfo />
          </>
        ),
      }
  }
}
