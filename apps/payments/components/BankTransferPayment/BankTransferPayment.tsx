import { AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { PaymentContainer } from '../PaymentContainer/PaymentContainer'
import { bankTransfer } from '../../messages'

/**
 * The body shown between the {@link PaymentSelector} and the submit button when the user has
 * selected the bank-transfer method. Intentionally minimal — v1 is **anonymous** (no account
 * dropdown). The redirect to the bank's SCA page happens after the user submits, via
 * {@link useBankTransferPayment}.
 */
export const BankTransferPayment = () => {
  const { formatMessage } = useLocale()

  return (
    <PaymentContainer>
      <AlertMessage
        type="info"
        message={formatMessage(bankTransfer.disclaimer)}
      />
    </PaymentContainer>
  )
}
