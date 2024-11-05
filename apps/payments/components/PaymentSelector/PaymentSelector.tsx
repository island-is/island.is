import { Box, Link, Logo, Text, Button, Input } from '@island.is/island-ui/core'

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

  return (
    <>
      {availablePaymentMethods.length > 0 && (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="spaceBetween"
          columnGap={1}
        >
          {/* TODO use toggle buttons similar to menu in service-portal */}
          {hasCard && (
            <Button
              colorScheme={selectedPayment === 'card' ? 'white' : 'light'}
              onClick={() => onSelectPayment('card')}
              fluid
            >
              Kortagreiðsla
            </Button>
          )}
          {hasInvoice && (
            <Button
              colorScheme={selectedPayment === 'invoice' ? 'white' : 'light'}
              onClick={() => onSelectPayment('invoice')}
              fluid
            >
              Krafa í heimabanka
            </Button>
          )}
        </Box>
      )}
    </>
  )
}
