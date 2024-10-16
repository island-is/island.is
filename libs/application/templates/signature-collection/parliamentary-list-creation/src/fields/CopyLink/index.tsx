import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { CopyLink as Copy } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'

export const CopyLink: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { slug } = application.externalData.submit.data as { slug: string }

  return (
    <Box>
      <Text variant="h4" marginBottom={2}>
        {formatMessage(m.shareList)}
      </Text>
      <Copy
        linkUrl={`${document.location.origin}${slug}`}
        buttonTitle={formatMessage(m.copyLink)}
      />
    </Box>
  )
}

export default CopyLink
