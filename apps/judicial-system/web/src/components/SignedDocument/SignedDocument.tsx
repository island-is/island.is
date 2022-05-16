import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Icon, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { signedDocument } from '@island.is/judicial-system-web/messages'

interface Props {
  signatory?: string
  signingDate?: string
}

export const SignedDocument = (props: Props) => {
  const { formatMessage } = useIntl()
  const { signatory, signingDate } = props

  return (
    <Box display="flex" alignItems="center">
      <Box textAlign="right" marginX="gutter">
        <Text>
          {formatMessage(signedDocument, {
            date: formatDate(signingDate, 'dd.MM.yyyy'),
            time: formatDate(signingDate, 'HH:mm'),
          })}
        </Text>
        <Text variant="small">{signatory}</Text>
      </Box>
      <Icon icon="checkmark" size="large" color="mint600"></Icon>
    </Box>
  )
}
