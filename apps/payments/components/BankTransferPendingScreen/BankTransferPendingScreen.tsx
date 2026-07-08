import {
  Box,
  Button,
  Hidden,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { PaymentsBankTransferPendingStatus } from '@island.is/api/schema'

import { BankTransferQrCode } from '../BankTransferQrCode/BankTransferQrCode'
import { bankTransfer, generic } from '../../messages'

interface BankTransferPendingScreenProps {
  // Pending sub-status; SCA_REQUIRED renders the QR/deep-link UI, anything else the waiting UI.
  pendingStatus?: PaymentsBankTransferPendingStatus | null
  // The provider SCA URL. May be absent — arrives later via polling if at all.
  scaRedirectUrl?: string
  isCancelling: boolean
  onCancel: () => void
}

/**
 * Body of the bank-transfer pending screen.
 *
 * sca_required + URL → desktop: QR code; mobile: open-banking-app button.
 * sca_required without URL → "check your phone" message.
 * processing (SCA complete / not yet required) → waiting message.
 */
export const BankTransferPendingScreen = ({
  pendingStatus,
  scaRedirectUrl,
  isCancelling,
  onCancel,
}: BankTransferPendingScreenProps) => {
  const { formatMessage } = useLocale()

  const showSca =
    pendingStatus === PaymentsBankTransferPendingStatus.sca_required &&
    !!scaRedirectUrl

  return (
    <Box
      display="flex"
      flexDirection="column"
      rowGap={[3, 4]}
      paddingY={[2, 3]}
    >
      {showSca ? (
        <>
          {/* Desktop: the payer scans the SCA URL with their phone. */}
          <Hidden below="md">
            <BankTransferQrCode url={scaRedirectUrl} />
          </Hidden>
          {/* Mobile: deep link to banking app. */}
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

      <Box display="flex" justifyContent="center">
        <Button
          unfocusable
          variant="text"
          loading={isCancelling}
          onClick={onCancel}
        >
          {formatMessage(generic.buttonCancel)}
        </Button>
      </Box>
    </Box>
  )
}
