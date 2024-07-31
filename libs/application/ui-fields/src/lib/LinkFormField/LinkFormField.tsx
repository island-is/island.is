import { useCallback } from 'react'
import { formatText } from '@island.is/application/core'
import { LinkField, Application } from '@island.is/application/types'
import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import useGenerateFileUrl from './hooks/useGenerateFileUrl'

type Props = {
  field: LinkField
  application: Application
}

export const LinkFormField = ({ field, application }: Props) => {
  const { formatMessage } = useLocale()
  const openLink = useCallback(() => {
    window.open(
      formatText(field.link ?? '', application, formatMessage),
      '_blank',
    )
  }, [field.link, application, formatMessage])

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
