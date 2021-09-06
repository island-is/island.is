import React from 'react'
import { Text } from '@island.is/island-ui/core'

import { getState, ApplicationState } from '@island.is/financial-aid/shared'

interface Props {
  state: ApplicationState
}

const Rejected = ({ state }: Props) => {
  return (
    <>
      <Text as="h2" variant="h3" color="red400" marginBottom={[4, 4, 5]}>
        Umsókn {getState[state].toLowerCase()}
      </Text>

      <Text variant="intro">
        Umsóknin þinni um fjárhagsaðstoð í maí hefur verið synjað á grundvelli
        12. gr.: Tekjur og eignir umsækjanda. Líttu yfir greinina hér fyrir
        neðan og skráðu þig inn á stöðusíðuna og sendu okkur athugasemd eða
        viðeigandi gögn ef þú telur að niðurstaðan sé röng.
      </Text>
      {/* TODO: need rejction text here */}
    </>
  )
}

export default Rejected
