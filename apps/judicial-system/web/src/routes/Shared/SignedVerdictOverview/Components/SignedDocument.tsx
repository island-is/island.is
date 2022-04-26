import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Icon, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { signedVerdictOverview as m } from '@island.is/judicial-system-web/messages/Core/signedVerdictOverview'

interface Props {
  signatory?: string
  signingDate?: string
}

export const SignedDocument = (props: Props) => {
  const { formatMessage } = useIntl()
  const { signatory: judge, signingDate: rulingDate } = props

  return (
    <Box display="flex" alignItems="center">
      <Box textAlign="right" marginX="gutter">
        <Text>
          {formatMessage(m.signedDocument, {
            date: formatDate(rulingDate, 'dd.MM.yyyy'),
            time: formatDate(rulingDate, 'HH:mm'),
          })}
        </Text>
        <Text variant="small">{judge}</Text>
      </Box>
      <Icon icon="checkmark" size="large" color="mint600"></Icon>
    </Box>
  )
}
