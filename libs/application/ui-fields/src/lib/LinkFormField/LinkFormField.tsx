import React, { FC, useCallback } from 'react'
import { formatText } from '@island.is/application/core'
import { LinkField, Application } from '@island.is/application/types'
import { Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import useGeneratePdfUrl from './hooks/useGeneratePdfUrl'

export const LinkFormField: FC<{
  field: LinkField
  application: Application
}> = ({ field, application }) => {
  const { formatMessage } = useLocale()

  const openLink = useCallback(() => {
    window.open(field.link, '_blank')
  }, [field.link])

  const { getPdfUrl } = useGeneratePdfUrl(
    application.id,
    formatText(field.s3key ?? '', application, formatMessage),
  )

  const getUrl = () => {
    if (field.link) {
      return openLink
    }

    if (field.s3key) {
      return getPdfUrl
    }
    return () => ''
  }

  return (
    <Button
      colorScheme="default"
      icon="open"
      iconType="outline"
      onClick={getUrl()}
      preTextIconType="filled"
      size="default"
      type="button"
      variant="ghost"
    >
      {formatText(field.title, application, formatMessage)}
    </Button>
  )
}
