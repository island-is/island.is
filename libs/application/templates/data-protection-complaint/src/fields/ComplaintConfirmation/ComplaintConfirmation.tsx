import { FieldBaseProps, PdfTypes } from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import useGeneratePdfUrl from '../../hooks/useGeneratePdfUrl'
import { confirmation } from '../../lib/messages/confirmation'
import { CompanyIllustration } from '../Illustrations/CompanyIllustration'

export const ComplaintConfirmation: FC<FieldBaseProps> = ({
  application,
  field,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const pdfType = PdfTypes.DATA_PROTECTION_COMPLAINT
  const { pdfUrl, loading: pdfLoading } = useGeneratePdfUrl(
    application.id,
    pdfType,
  )
  return (
    <Box marginTop={3}>
      <Text>{formatMessage(confirmation.labels.bulletOne)}</Text>
      <Box marginTop={[3, 5, 12]}>
        <CompanyIllustration />
      </Box>
      <Box marginTop={5}>
        <Button
          colorScheme="default"
          icon="open"
          iconType="outline"
          onClick={() => window.open(pdfUrl, '_blank')}
          preTextIconType="filled"
          size="default"
          type="button"
          variant="ghost"
          loading={pdfLoading}
          disabled={!pdfUrl}
        >
          {formatMessage(confirmation.labels.pdfButton)}
        </Button>
      </Box>
    </Box>
  )
}
