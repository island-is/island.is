import React from 'react'
import { useIntl } from 'react-intl'

import { Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'

import { rulingDateLabel as strings } from './RulingDateLabel.strings'

interface Props {
  rulingDate: string
}

const RulingDateLabel: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const { rulingDate } = props
  const { formatMessage } = useIntl()

  return (
    <Text as="h5" variant="h5">
      {formatMessage(strings.text, {
        courtEndTime: `${formatDate(rulingDate, 'PPP')} kl. ${formatDate(
          rulingDate,
          constants.TIME_FORMAT,
        )}`,
      })}
    </Text>
  )
}

export default RulingDateLabel
