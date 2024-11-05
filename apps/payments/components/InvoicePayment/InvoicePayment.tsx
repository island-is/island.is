import { Box, Link, Logo, Text, Button, Input } from '@island.is/island-ui/core'
import { PaymentContainer } from '../PaymentContainer/PaymentContainer'

export const InvoicePayment = () => {
  return (
    <>
      <PaymentContainer>
        <Input
          backgroundColor="blue"
          label="Kennitala greiðanda"
          name="nationalId"
          size="md"
        />
        <Input
          backgroundColor="blue"
          label="Tilvísun"
          name="reference"
          size="md"
        />
      </PaymentContainer>
      <Button fluid>Stofna kröfu</Button>
    </>
  )
}
