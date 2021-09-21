import React, { useContext } from 'react'
import { Text, GridContainer, Button } from '@island.is/island-ui/core'

import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'

import { useRouter } from 'next/router'
import { Routes } from '@island.is/financial-aid/shared/lib'

const HasApplied = () => {
  const { user } = useContext(UserContext)
  const router = useRouter()

  return (
    <>
      <Text as="h1" variant="h2" marginBottom={[3, 3, 5]}>
        Abbabbab {user?.name ?? ''} <br />
        þú hefur þegar sótt um fyrir þennan mánuð
      </Text>

      <Button
        onClick={() => {
          router.push(
            `${Routes.statusPage(user?.currentApplication?.id as string)}`,
          )
        }}
      >
        Kíktu á stöðu síðuna{' '}
      </Button>
    </>
  )
}

export default HasApplied
