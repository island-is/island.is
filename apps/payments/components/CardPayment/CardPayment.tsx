import { useFormContext } from 'react-hook-form'

import { Box, Button, Input } from '@island.is/island-ui/core'

import { PaymentContainer } from '../PaymentContainer/PaymentContainer'

interface CardPaymentInput {
  card: string
  cardExpiry: string
  cardCVC: string
}

export const CardPayment = () => {
  const { register, formState } = useFormContext<CardPaymentInput>()

  return (
    <>
      <PaymentContainer>
        <Input
          backgroundColor="blue"
          label="Kortanúmer"
          placeholder="**** **** **** ****"
          size="md"
          {...register('card', {
            required: true,
            pattern: {
              // number between 13-19 digits
              value: /^[0-9]{13,19}$/,
              message: 'Kortanúmer er ekki rétt',
            },
          })}
          errorMessage={formState.errors.card?.message}
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
              {...register('cardExpiry', {
                required: true,
              })}
              placeholder="MM / ÁÁ"
              size="md"
              rows={6}
            />
          </Box>
          <Box width="full">
            <Input
              backgroundColor="blue"
              label="Öryggiskóði"
              {...register('cardCVC', {
                required: true,
              })}
              placeholder="***"
              size="md"
              rows={6}
            />
          </Box>
        </Box>
      </PaymentContainer>
    </>
  )
}
