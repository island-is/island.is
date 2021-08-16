import React, { useContext } from 'react'
import { Text, GridContainer } from '@island.is/island-ui/core'

import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'

const HasApplied = () => {
  const { user } = useContext(UserContext)

  return (
    <GridContainer>
      <Text as="h1" variant="h2" marginBottom={[3, 3, 5]}>
        Abbabbab {user?.name} <br />
        þú hefur þegar sótt um fyrir þennan mánuð
      </Text>

      <Text>Kíktu á stöðu síðuna </Text>
    </GridContainer>
  )
}

export default HasApplied
