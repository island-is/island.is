import React from 'react'
import { Text } from '@island.is/island-ui/core'

import {
  ApplicationState,
  getState,
  getMonth,
} from '@island.is/financial-aid/shared/lib'

interface Props {
  state: ApplicationState
  amount?: number
  isStateVisible: boolean
}

const Approved = ({ state, amount, isStateVisible }: Props) => {
  const currentMonth = getMonth(new Date().getMonth())

  if (!isStateVisible) {
    return null
  }

  return (
    <>
      <Text as="h2" variant="h3" color="mint600" marginBottom={[4, 4, 5]}>
        Umsókn {getState[state].toLowerCase()}
      </Text>

      <Text as="h3" variant="h3" marginBottom={2}>
        Veitt aðstoð :{amount?.toLocaleString('de-DE') + ' kr.'}
      </Text>

      {/* //TODO estimated aid, need approval */}
    </>
  )
}

export default Approved
