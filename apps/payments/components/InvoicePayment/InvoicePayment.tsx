import { useFormContext } from 'react-hook-form'

import { Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { PaymentContainer } from '../PaymentContainer/PaymentContainer'
import { invoice } from '../../messages'
import { formatNationalId } from '../../utils'

interface InvoicePaymentInput {
  nationalId: string
  reference: string
}

export const InvoicePayment = ({
  nationalId,
  reference,
}: InvoicePaymentInput) => {
  const { formatMessage } = useLocale()
  const { register } = useFormContext<InvoicePaymentInput>()

  return (
    <>
      <PaymentContainer>
        <Input
          backgroundColor="blue"
          label={formatMessage(invoice.nationalIdOfPayer)}
          {...register('nationalId', {
            required: true,
          })}
          size="sm"
          value={formatNationalId(nationalId)}
          readOnly
        />
        <Input
          backgroundColor="blue"
          label={formatMessage(invoice.invoiceReference)}
          {...register('reference', {
            required: false,
          })}
          size="sm"
          value={reference}
          readOnly
        />
      </PaymentContainer>
    </>
  )
}
