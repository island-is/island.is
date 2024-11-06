import { useFormContext } from 'react-hook-form'

import { Input } from '@island.is/island-ui/core'
import { PaymentContainer } from '../PaymentContainer/PaymentContainer'

interface InvoicePaymentInput {
  nationalId: string
  reference?: string
}

export const InvoicePayment = () => {
  const { register } = useFormContext<InvoicePaymentInput>()

  return (
    <>
      <PaymentContainer>
        <Input
          backgroundColor="blue"
          label="Kennitala greiðanda"
          {...register('nationalId', {
            required: true,
          })}
          size="md"
        />
        <Input
          backgroundColor="blue"
          label="Tilvísun"
          {...register('reference', {
            required: false,
          })}
          size="md"
        />
      </PaymentContainer>
    </>
  )
}
