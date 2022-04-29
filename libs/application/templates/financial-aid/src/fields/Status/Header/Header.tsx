import React from 'react'
import { useIntl } from 'react-intl'

import { Text } from '@island.is/island-ui/core'
import {
  ApplicationState,
  getNextPeriod,
} from '@island.is/financial-aid/shared/lib'
import { getStateMessageAndColor } from '../../../lib/formatters'

interface Props {
  state: ApplicationState
}

const Header = ({ state }: Props) => {
  if (!state) {
    return null
  }
  const { formatMessage } = useIntl()

  return (
    <Text
      as="h3"
      variant="h3"
      color={getStateMessageAndColor[state][1]}
      marginBottom={[4, 4, 5]}
    >
      {formatMessage(getStateMessageAndColor[state][0], {
        month: getNextPeriod.month,
        year: getNextPeriod.year,
      })}
    </Text>
  )
}

export default Header
