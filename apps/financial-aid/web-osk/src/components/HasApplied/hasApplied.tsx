import React, { useContext } from 'react'
import { Text, GridContainer, Button } from '@island.is/island-ui/core'

import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'

import { useRouter } from 'next/router'

const HasApplied = () => {
  const { user } = useContext(UserContext)
  const router = useRouter()

  return (
    <GridContainer>
      <Text as="h1" variant="h2" marginBottom={[3, 3, 5]}>
        Abbabbab {user?.name ?? ''} <br />
        þú hefur þegar sótt um fyrir þennan mánuð
      </Text>

      <Button
        onClick={() => {
          router.push(`/${user?.currentApplication?.id}`)
        }}
      >
        Kíktu á stöðu síðuna{' '}
      </Button>
    </GridContainer>
  )
}

export default HasApplied
