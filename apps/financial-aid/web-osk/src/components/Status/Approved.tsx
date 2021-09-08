import React from 'react'
import { Text } from '@island.is/island-ui/core'

import {
  ApplicationState,
  getState,
  months,
} from '@island.is/financial-aid/shared/lib'
import format from 'date-fns/format'

interface Props {
  state: ApplicationState
}

const Approved = ({ state }: Props) => {
  const currentMonth = parseInt(format(new Date(), 'MM')) - 1

  return (
    <>
      <Text as="h2" variant="h3" color="mint600" marginBottom={[4, 4, 7]}>
        Umsókn {getState[state].toLowerCase()}
      </Text>
      <Text variant="intro">
        Umsóknin þín um fjárhagsaðstoð í {months[currentMonth].toLowerCase()} er
        samþykkt en athugaðu að hún byggir á tekjum og öðrum þáttum sem kunna að
        koma upp í {months[currentMonth].toLowerCase()} og getur því tekið
        breytingum.
      </Text>
      {/* //TODO estimated aid, need approval */}
    </>
  )
}

export default Approved
