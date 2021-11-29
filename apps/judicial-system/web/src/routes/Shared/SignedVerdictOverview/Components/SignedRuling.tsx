import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Icon, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { signedVerdictOverview as m } from '@island.is/judicial-system-web/messages/Core/signedVerdictOverview'

interface Props {
  judge?: string
  rulingDate?: string
}

export const SignedRuling = (props: Props) => {
  const { formatMessage } = useIntl()
  const { judge, rulingDate } = props

  return (
    <Box display="flex" alignItems="center">
      <Box textAlign="right" marginX="gutter">
        <Text>
          {formatMessage(m.signedRuling, {
            date: formatDate(rulingDate, 'dd.MM.yyyy'),
            time: formatDate(rulingDate, 'HH:mm'),
          })}
        </Text>
        <Text>{judge}</Text>
      </Box>
      <Icon icon="checkmark" size="large" color="mint600"></Icon>
    </Box>
  )
}
