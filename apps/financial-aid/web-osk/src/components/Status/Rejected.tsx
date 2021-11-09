import React from 'react'
import { Button, Text, Box } from '@island.is/island-ui/core'

import { getState, ApplicationState } from '@island.is/financial-aid/shared/lib'

interface Props {
  state: ApplicationState
  rejectionComment?: string
  isStateVisible: boolean
  isApplicant?: boolean
}

const Rejected = ({
  state,
  rejectionComment,
  isStateVisible,
  isApplicant = true,
}: Props) => {
  if (!isStateVisible) {
    return null
  }

  return (
    <>
      <Text as="h2" variant="h3" color="red400" marginBottom={[4, 4, 5]}>
        Umsókn {getState[state].toLowerCase()}
      </Text>

      {isApplicant && (
        <>
          {rejectionComment && (
            <Text variant="intro" marginBottom={[2, 2, 3]}>
              {rejectionComment}
            </Text>
          )}

          <Box marginBottom={[3, 3, 5]}>
            <Button
              variant="text"
              icon="open"
              iconType="outline"
              onClick={() => {
                window.open('', '_ blank')
              }}
            >
              Reglur um fjárhagsaðstoð
            </Button>
          </Box>

          <Text as="h3" variant="h3" marginBottom={2}>
            Málskot
          </Text>

          <Text>
            Ef þú telur að niðurstaðan sé röng átt þú rétt á að áfrýja innan
            fjögurra vikna frá niðurstöðu. Smelltu á hnappinn hér fyrir neðan og
            gerðu grein fyrir þínum rökum. Áfrýjunarnefnd þíns sveitarfélags mun
            taka málið fyrir. Ákvörðun áfrýjunarnefndar er hægt að skjóta til
            úrskurðarnefndar velferðarmála, innan þriggja mánaða sbr. 5.gr. laga
            nr. 85/2015
          </Text>
        </>
      )}
    </>
  )
}

export default Rejected
