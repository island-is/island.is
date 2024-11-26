import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { card, invoice } from '../../messages'

type PaymentMethod = 'card' | 'invoice'

interface PaymentSelectorProps {
  availablePaymentMethods: PaymentMethod[]
  selectedPayment: PaymentMethod
  onSelectPayment: (paymentMethod: PaymentMethod) => void
}

export const PaymentSelector = ({
  availablePaymentMethods,
  selectedPayment,
  onSelectPayment,
}: PaymentSelectorProps) => {
  const { formatMessage } = useLocale()
  const hasCard = availablePaymentMethods.includes('card')
  const hasInvoice = availablePaymentMethods.includes('invoice')

  if (availablePaymentMethods.length <= 1) {
    return null
  }

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="spaceBetween"
      columnGap={1}
      marginBottom={2}
    >
      {/* TODO use toggle buttons similar to menu in service-portal */}
      {hasCard && (
        <Button
          colorScheme={selectedPayment === 'card' ? 'light' : 'white'}
          onClick={() => onSelectPayment('card')}
          fluid
        >
          {formatMessage(card.paymentMethodTitle)}
        </Button>
      )}
      {hasInvoice && (
        <Button
          colorScheme={selectedPayment === 'invoice' ? 'light' : 'white'}
          onClick={() => onSelectPayment('invoice')}
          fluid
        >
          {formatMessage(invoice.paymentMethodTitle)}
        </Button>
      )}
    </Box>
  )
}
