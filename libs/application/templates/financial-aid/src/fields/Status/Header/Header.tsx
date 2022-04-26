import React from 'react'
import { useIntl } from 'react-intl'

import { Text } from '@island.is/island-ui/core'
import {
  ApplicationState,
  getNextPeriod,
} from '@island.is/financial-aid/shared/lib'
import { Colors } from '@island.is/island-ui/theme'

import { status } from '../../../lib/messages'

interface Props {
  state: ApplicationState
}

const Header = ({ state }: Props) => {
  if(!state) {
    return null
  }
  
  const { formatMessage } = useIntl()

  const text = {
    [ApplicationState.NEW]: [formatMessage(status.header.new), 'blue400'],
    [ApplicationState.APPROVED]: [formatMessage(status.header.approved), 'mint600'],
    [ApplicationState.REJECTED]: [formatMessage(status.header.rejected), 'red400'],
    [ApplicationState.INPROGRESS]: [
      formatMessage(status.header.inProgress, {
        month: getNextPeriod.month,
        year: getNextPeriod.year,
      }),
      'blue400',
    ],
    [ApplicationState.DATANEEDED]: [
      formatMessage(status.header.inProgress, {
        month: getNextPeriod.month,
        year: getNextPeriod.year,
      }),
      'blue400',
    ],
  }

  return (
    <Text
      as="h2"
      variant="h3"
      color={text[state][1] as Colors}
      marginBottom={[4, 4, 5]}
    >
      {text[state][0]}
    </Text>
  )
}

export default Header
