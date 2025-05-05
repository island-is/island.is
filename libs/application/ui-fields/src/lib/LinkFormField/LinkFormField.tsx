import { useCallback } from 'react'
import { formatText, formatTextWithLocale } from '@island.is/application/core'
import { LinkField, Application } from '@island.is/application/types'
import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import useGenerateFileUrl from './hooks/useGenerateFileUrl'
import { Locale } from '@island.is/shared/types'

type Props = {
  field: LinkField
  application: Application
}

export const LinkFormField = ({ field, application }: Props) => {
  const { formatMessage, lang: locale } = useLocale()
  const { variant, justifyContent } = field
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
  const { marginTop = 2, marginBottom = 2 } = field

  return (
    <Box
      marginTop={marginTop}
      marginBottom={marginBottom}
      display="flex"
      justifyContent={justifyContent}
    >
      <Button
        colorScheme="default"
        icon={field.iconProps?.icon ?? 'download'}
        iconType={field.iconProps?.type ?? 'outline'}
        onClick={getUrl()}
        preTextIconType="filled"
        size="small"
        type="button"
        variant={variant}
      >
        {formatTextWithLocale(
          field.title ?? '',
          application,
          locale as Locale,
          formatMessage,
        )}
      </Button>
    </Box>
  )
}
