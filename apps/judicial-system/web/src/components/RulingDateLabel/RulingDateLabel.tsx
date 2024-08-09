import React, { FC } from 'react'
import { useIntl } from 'react-intl'

import { Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  formatDate,
  FormatPattern,
} from '@island.is/judicial-system/formatters'

import { rulingDateLabel as strings } from './RulingDateLabel.strings'

interface Props {
  rulingDate: string
}

const RulingDateLabel: FC<Props> = ({ rulingDate }) => {
  const { formatMessage } = useIntl()

  return (
    <Text as="h5" variant="h5">
      {formatMessage(strings.text, {
        courtEndTime: formatDate(rulingDate, FormatPattern.LONG_DATE_YEAR_TIME),
      })}
    </Text>
  )
}

export default RulingDateLabel
