import React, { FC, useCallback } from 'react'
import { formatText } from '@island.is/application/core'
import { LinkField, Application } from '@island.is/application/types'
import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import useGenerateFileUrl from './hooks/useGenerateFileUrl'

export const LinkFormField: FC<
  React.PropsWithChildren<{
    field: LinkField
    application: Application
  }>
> = ({ field, application }) => {
  const { formatMessage } = useLocale()

  const openLink = useCallback(() => {
    window.open(field.link, '_blank')
  }, [field.link])

  const { getFileUrl } = useGenerateFileUrl(
    application.id,
    formatText(field.s3key ?? '', application, formatMessage),
  )

  const getUrl = () => {
    if (field.link) {
      return openLink
    }

    if (field.s3key) {
      return getFileUrl
    }
    return () => ''
  }

  return (
    <Box marginY={2}>
      <Button
        colorScheme="default"
        icon={field.iconProps?.icon ?? 'download'}
        iconType={field.iconProps?.type ?? 'outline'}
        onClick={getUrl()}
        preTextIconType="filled"
        size="small"
        type="button"
        variant="ghost"
      >
        {formatText(field.title, application, formatMessage)}
      </Button>
    </Box>
  )
}
