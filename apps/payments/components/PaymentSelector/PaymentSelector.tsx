import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { ButtonPayment as Button } from '../ButtonPayment/ButtonPayment'

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
    >
      {hasCard && (
        <Button
          isSelected={selectedPayment === 'card'}
          onClick={() => onSelectPayment('card')}
          type="card"
        >
          {formatMessage(card.paymentMethodTitle)}
        </Button>
      )}
      {hasInvoice && (
        <Button
          isSelected={selectedPayment === 'invoice'}
          onClick={() => onSelectPayment('invoice')}
          type="invoice"
        >
          {formatMessage(invoice.paymentMethodTitle)}
        </Button>
      )}
    </Box>
  )
}
