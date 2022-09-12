import { FC } from 'react'
import {
  ContentBlock,
  AlertMessage,
  Text,
  Box,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { m } from '../lib/messages'

export const QualityAlert: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box justifyContent={'spaceBetween'} marginBottom={4}>
      <Text variant="h3">
        {formatText(m.signatureAndImage, application, formatMessage)}
      </Text>
      <Box marginTop={3} marginBottom={3}>
        <ContentBlock>
          <AlertMessage
            type="info"
            message={formatText(
              m.signatureAndImageAlert,
              application,
              formatMessage,
            )}
          />
        </ContentBlock>
      </Box>
    </Box>
  )
}
