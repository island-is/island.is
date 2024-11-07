import { Box, Button } from '@island.is/island-ui/core'

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
          Kortagreiðsla
        </Button>
      )}
      {hasInvoice && (
        <Button
          colorScheme={selectedPayment === 'invoice' ? 'light' : 'white'}
          onClick={() => onSelectPayment('invoice')}
          fluid
        >
          Krafa í heimabanka
        </Button>
      )}
    </Box>
  )
}
