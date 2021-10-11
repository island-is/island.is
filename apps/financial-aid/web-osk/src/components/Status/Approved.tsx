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
}

const Approved = ({ state, amount }: Props) => {
  const currentMonth = getMonth(new Date().getMonth())

  if (state !== ApplicationState.APPROVED) {
    return null
  }

  return (
    <>
      <Text as="h2" variant="h3" color="mint600" marginBottom={[3, 3, 5]}>
        Umsókn {getState[state].toLowerCase()}
      </Text>
      <Text variant="intro">
        Umsóknin þín um fjárhagsaðstoð í {currentMonth} er samþykkt.
      </Text>

      <Text as="h3" variant="h3" marginBottom={2}>
        Veitt aðstoð :{amount?.toLocaleString('de-DE') + ' kr.'}
      </Text>

      {/* //TODO estimated aid, need approval */}
    </>
  )
}

export default Approved
