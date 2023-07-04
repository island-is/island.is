import React from 'react'
import { useIntl } from 'react-intl'

import { Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import * as constants from '@island.is/judicial-system/consts'

import { rulingDateLabel as strings } from './RulingDateLabel.strings'

interface Props {
  courtEndTime: string
}

const RulingDateLabel: React.FC<Props> = (props) => {
  const { courtEndTime } = props
  const { formatMessage } = useIntl()

  return (
    <Text as="h5" variant="h5">
      {formatMessage(strings.text, {
        courtEndTime: `${formatDate(courtEndTime, 'PPP')} kl. ${formatDate(
          courtEndTime,
          constants.TIME_FORMAT,
        )}`,
      })}
    </Text>
  )
}

export default RulingDateLabel
