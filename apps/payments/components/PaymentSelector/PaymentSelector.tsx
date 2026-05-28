import type { MessageDescriptor } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { ButtonPayment as Button } from '../ButtonPayment/ButtonPayment'

import { bankTransfer, card, invoice } from '../../messages'

export type PaymentMethod = 'card' | 'invoice' | 'bank_transfer'

interface PaymentSelectorProps {
  availablePaymentMethods: PaymentMethod[]
  selectedPayment: PaymentMethod
  onSelectPayment: (paymentMethod: PaymentMethod) => void
}

interface PaymentMethodOption {
  method: PaymentMethod
  title: MessageDescriptor
}

// Render order is the order the user sees the buttons in. Card → invoice → bank transfer keeps the
// historic ordering for flows that have always had card + invoice, with the new option appended.
const PAYMENT_METHOD_OPTIONS: readonly PaymentMethodOption[] = [
  { method: 'card', title: card.paymentMethodTitle },
  { method: 'invoice', title: invoice.paymentMethodTitle },
  { method: 'bank_transfer', title: bankTransfer.paymentMethodTitle },
]

export const PaymentSelector = ({
  availablePaymentMethods,
  selectedPayment,
  onSelectPayment,
}: PaymentSelectorProps) => {
  const { formatMessage } = useLocale()

  const options = PAYMENT_METHOD_OPTIONS.filter((option) =>
    availablePaymentMethods.includes(option.method),
  )

  // Nothing to choose between — let the parent flow render the single available method directly.
  if (options.length < 2) {
    return null
  }

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="spaceBetween"
      columnGap={1}
    >
      {options.map((option) => (
        <Button
          key={option.method}
          isSelected={selectedPayment === option.method}
          onClick={() => onSelectPayment(option.method)}
          type={option.method}
        >
          {formatMessage(option.title)}
        </Button>
      ))}
    </Box>
  )
}
