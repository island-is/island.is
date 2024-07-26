import React from 'react'
import { useIntl } from 'react-intl'
import { Text } from '@island.is/island-ui/core'
import {
  ApplicationState,
  getNextPeriod,
} from '@island.is/financial-aid/shared/lib'
import { useLocale } from '@island.is/localization'
import { getStateMessageAndColor } from '../../../lib/formatters'

interface Props {
  state?: ApplicationState
}

const Header = ({ state }: Props) => {
  const { formatMessage } = useIntl()
  const { lang } = useLocale()

  if (!state) {
    return null
  }

  return (
    <Text
      as="h3"
      variant="h3"
      color={getStateMessageAndColor[state][1]}
      marginBottom={[4, 4, 5]}
    >
      {formatMessage(getStateMessageAndColor[state][0], {
        month: getNextPeriod(lang).month,
        year: getNextPeriod(lang).year,
      })}
    </Text>
  )
}

export default Header
