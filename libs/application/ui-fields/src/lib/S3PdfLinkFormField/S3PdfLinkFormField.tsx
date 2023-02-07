import React, { FC } from 'react'
import { formatText } from '@island.is/application/core'
import { S3PdfLinkField, Application } from '@island.is/application/types'
import { Box, Text, Divider, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import useGeneratePdfUrl from './hooks/useGeneratePdfUrl'

export const S3PdfLinkFormField: FC<{
  field: S3PdfLinkField
  application: Application
}> = ({ field, application }) => {
  const { formatMessage } = useLocale()

  const { getPdfUrl } = useGeneratePdfUrl(
    application.id,
    formatText(field.s3key, application, formatMessage),
  )

  return (
    <Button
      colorScheme="default"
      icon="open"
      iconType="outline"
      onClick={getPdfUrl}
      preTextIconType="filled"
      size="default"
      type="button"
      variant="ghost"
    >
      {formatText(field.title, application, formatMessage)}
    </Button>
  )
}
