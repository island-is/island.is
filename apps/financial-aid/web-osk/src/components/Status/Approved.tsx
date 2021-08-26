import React from 'react'
import { Text } from '@island.is/island-ui/core'

import { ApplicationState, getState } from '@island.is/financial-aid/shared'

interface Props {
  state: ApplicationState
}

const Approved = ({ state }: Props) => {
  return (
    <>
      <Text as="h2" variant="h3" color="mint600" marginBottom={[4, 4, 7]}>
        Umsókn {getState[state].toLowerCase()}
      </Text>

      <Text variant="intro">
        Umsóknin þín um fjárhagsaðstoð í ágúst er samþykkt en athugaðu að hún
        byggir á tekjum og öðrum þáttum sem kunna að koma upp í ágúst og getur
        því tekið breytingum.
      </Text>
    </>
  )
}

export default Approved
