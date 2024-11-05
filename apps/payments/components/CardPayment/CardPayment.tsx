import { Box, Button, Input } from '@island.is/island-ui/core'

import { PaymentContainer } from '../PaymentContainer/PaymentContainer'

export const CardPayment = () => {
  return (
    <>
      <PaymentContainer>
        <Input
          backgroundColor="blue"
          label="Kortanúmer"
          name="card"
          placeholder="**** **** **** ****"
          size="md"
        />
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="spaceBetween"
          columnGap={2}
        >
          <Box width="full">
            <Input
              backgroundColor="blue"
              label="Gildistími"
              name="cardExpiry"
              placeholder="MM / ÁÁ"
              size="md"
              rows={6}
            />
          </Box>
          <Box width="full">
            <Input
              backgroundColor="blue"
              label="CVC"
              name="cardCVC"
              placeholder="Öryggiskóði"
              size="md"
              rows={6}
            />
          </Box>
        </Box>
      </PaymentContainer>
      <Button fluid>Greiða</Button>
    </>
  )
}
