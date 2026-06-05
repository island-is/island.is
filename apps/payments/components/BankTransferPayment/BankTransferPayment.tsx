import { AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { PaymentContainer } from '../PaymentContainer/PaymentContainer'
import { bankTransfer } from '../../messages'

interface BankTransferPaymentProps {
  /**
   * `true` while {@link useBankTransferStatusPolling} is in flight — the user has submitted an
   * attempt (or returned from SCA) and we're polling for terminal status. Swaps the disclaimer
   * banner for the single waiting string.
   */
  isWaiting: boolean
}

/**
 * The body shown between the {@link PaymentSelector} and the submit button when the user has
 * selected the bank-transfer method. Intentionally minimal — v1 is **anonymous** (no account
 * dropdown). The redirect to the bank's SCA page happens after the user submits, via
 * {@link useBankTransferPayment}; the waiting state covers both the return-from-SCA window and
 * the back-channel-SCA case where the user stays on the page.
 */
export const BankTransferPayment = ({
  isWaiting,
}: BankTransferPaymentProps) => {
  const { formatMessage } = useLocale()

  return (
    <PaymentContainer>
      <AlertMessage
        type={isWaiting ? 'default' : 'info'}
        message={formatMessage(
          isWaiting ? bankTransfer.waiting : bankTransfer.disclaimer,
        )}
      />
    </PaymentContainer>
  )
}
