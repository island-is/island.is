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
  // Pending sub-status. Drives the waiting message only — never whether the SCA URL is offered.
  pendingStatus?: PaymentsBankTransferPendingStatus | null
  // Provider SCA URL. Absent means there is nothing to redirect to; it can appear or disappear
  // between polls, so the caller must always pass the latest value rather than a cached one.
  scaRedirectUrl?: string
}

/**
 * Body of the bank-transfer pending screen.
 *
 * Blikk's rule is to offer the redirect whenever `scaRedirectUrl` is non-empty, *regardless of
 * status*. So the URL's presence alone decides whether we show it, and the sub-status only decides
 * what we say while there is nothing to show:
 *
 * URL present → desktop: QR code; mobile: a button into Blikk's hosted payment page.
 * No URL, sca_required → back-channel SCA (e.g. Íslandsbanki): "check your phone".
 * No URL otherwise → waiting on the bank.
 *
 * Payments that enter this screen can not be cancelled by Blikk. User must do it in their banking app.
 */
export const BankTransferPendingScreen = ({
  pendingStatus,
  scaRedirectUrl,
}: BankTransferPendingScreenProps) => {
  const { formatMessage } = useLocale()

  const showSca = !!scaRedirectUrl

  const isScaOutstanding =
    pendingStatus === PaymentsBankTransferPendingStatus.sca_required

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
          {/* Mobile: opens Blikk's hosted payment page, which hands off to the banking app. */}
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
          <Text textAlign="center">
            {formatMessage(
              pendingStatus === PaymentsBankTransferPendingStatus.sca_required
                ? bankTransfer.checkPhone
                : bankTransfer.waitingForAuthorisation,
            )}
          </Text>
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
