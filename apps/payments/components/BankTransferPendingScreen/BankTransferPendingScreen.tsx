import {
  AlertMessage,
  Box,
  Button,
  Hidden,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { PaymentsBankTransferPendingStatus } from '@island.is/api/schema'

import { BankTransferQrCode } from '../BankTransferQrCode/BankTransferQrCode'
import { bankTransfer } from '../../messages'

interface BankTransferPendingScreenProps {
  // Pending sub-status; only sca_required means the payer has something to act on.
  pendingStatus?: PaymentsBankTransferPendingStatus | null
  // Provider SCA URL, only ever populated at sca_required. It can appear or disappear between
  // polls, so the caller must always pass the latest value rather than a cached one.
  scaRedirectUrl?: string
}

/**
 * Body of the bank-transfer pending screen.
 *
 * The URL is offered only once Blikk has reached SCA_REQUIRED, because that is the point at which
 * Blikk hands over the payer's bank's own authorisation page — and decides whether there is a page
 * at all. The URL returned when the payment is created is a different, provider-hosted one; showing
 * it early flashes a QR that a back-channel bank (Íslandsbanki) then removes.
 *
 * sca_required + URL → desktop: QR code; mobile: a button into the bank's authorisation page.
 * sca_required without URL → back-channel SCA (e.g. Íslandsbanki): "check your phone".
 * processing → loading dots only.
 *
 * Payments that enter this screen can not be cancelled by Blikk. User must do it in their banking app.
 */
export const BankTransferPendingScreen = ({
  pendingStatus,
  scaRedirectUrl,
}: BankTransferPendingScreenProps) => {
  const { formatMessage } = useLocale()

  const isScaOutstanding =
    pendingStatus === PaymentsBankTransferPendingStatus.sca_required

  const showSca = isScaOutstanding && !!scaRedirectUrl

  return (
    <Box
      display="flex"
      flexDirection="column"
      rowGap={[3, 4]}
      paddingY={[2, 3]}
    >
      {showSca ? (
        <>
          {/* Desktop: the payer scans the URL with their phone to continue there. */}
          <Hidden below="md">
            <BankTransferQrCode url={scaRedirectUrl} />
          </Hidden>
          {/* Mobile: opens the bank's authorisation page, which hands off to the banking app. */}
          <Hidden above="sm">
            <Box display="flex" flexDirection="column" rowGap={[2, 3]}>
              <Button
                fluid
                unfocusable
                onClick={() => window.location.assign(scaRedirectUrl)}
              >
                {formatMessage(bankTransfer.openBankingApp)}
              </Button>
              <Text textAlign="center">
                {formatMessage(bankTransfer.openBankingAppInstruction)}
              </Text>
            </Box>
          </Hidden>
        </>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          rowGap={[2, 3]}
        >
          <LoadingDots />
          {/* At `processing` nothing is being asked of the payer, so the dots stand alone. The
              message appearing — together with the note below — is what marks the moment the
              bank does want something, which a text swap alone made too easy to miss. */}
          {isScaOutstanding && (
            <Text textAlign="center">
              {formatMessage(bankTransfer.checkPhone)}
            </Text>
          )}
        </Box>
      )}

      {isScaOutstanding && (
        <AlertMessage
          type="info"
          message={formatMessage(bankTransfer.cancelInBankAppNote)}
        />
      )}
    </Box>
  )
}
