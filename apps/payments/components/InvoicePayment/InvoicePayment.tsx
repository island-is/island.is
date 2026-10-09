import { useFormContext } from 'react-hook-form'
import { format as formatKennitala } from 'kennitala'

import { Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { PaymentContainer } from '../PaymentContainer/PaymentContainer'
import { invoice } from '../../messages'

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
          // `format` throws on a missing value, so one is shown empty instead.
          value={nationalId ? formatKennitala(nationalId) : ''}
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
