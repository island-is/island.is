import React from 'react'

import { Text } from '@island.is/island-ui/core'
import {
  ApplicationState,
} from '@island.is/financial-aid/shared/lib'
import { getStateMessageAndColor } from '../../../lib/formatters'

interface Props {
  state: ApplicationState
}

const Header = ({ state }: Props) => {
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
      {getStateMessageAndColor[state][0]}
    </Text>
  )
}

export default Header
