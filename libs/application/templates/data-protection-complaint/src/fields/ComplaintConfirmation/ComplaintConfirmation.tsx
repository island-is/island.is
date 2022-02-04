import { useMutation } from '@apollo/client'
import { FieldBaseProps, PdfTypes } from '@island.is/application/core'
import { GENERATE_PDF_PRESIGNED_URL } from '@island.is/application/graphql'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC, useCallback } from 'react'
import useGeneratePdfUrl from '../../hooks/useGeneratePdfUrl'
import { confirmation } from '../../lib/messages/confirmation'
import { CompanyIllustration } from '../Illustrations/CompanyIllustration'

export const ComplaintConfirmation: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const pdfType = PdfTypes.DATA_PROTECTION_COMPLAINT
  const { getPdfUrl, loading } = useGeneratePdfUrl(application.id, pdfType)

  return (
    <Box marginTop={3}>
      <Text>{formatMessage(confirmation.labels.bulletOne)}</Text>
      <Box marginTop={5}>
        <Button
          colorScheme="default"
          icon="open"
          iconType="outline"
          onClick={getPdfUrl}
          preTextIconType="filled"
          size="default"
          type="button"
          variant="ghost"
          loading={loading}
        >
          {formatMessage(confirmation.labels.pdfButton)}
        </Button>
      </Box>
      <Box marginTop={[3, 5, 12]}>
        <CompanyIllustration />
      </Box>
    </Box>
  )
}
