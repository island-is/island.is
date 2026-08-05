import { QRCodeSVG } from 'qrcode.react'

import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'

import { bankTransfer } from '../../messages'

interface BankTransferQrCodeProps {
  // The raw provider SCA URL, encoded verbatim into the QR code.
  url: string
}

const QR_CODE_SIZE = 200

/**
 * The SCA QR code shown on the desktop pending screen — the payer scans it with
 * their phone to open the banking app.
 */
export const BankTransferQrCode = ({ url }: BankTransferQrCodeProps) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      rowGap={[2, 3]}
    >
      <Box
        background="white"
        border="standard"
        borderColor="blue200"
        borderRadius="large"
        padding={2}
        display="flex"
        justifyContent="center"
      >
        <QRCodeSVG
          value={url}
          size={QR_CODE_SIZE}
          fgColor={theme.color.blue400}
        />
      </Box>
      <Text variant="h4" textAlign="center">
        {formatMessage(bankTransfer.scanQrInstruction)}
      </Text>
    </Box>
  )
}
