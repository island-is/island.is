import React, { useContext } from 'react'
import { Text, Button } from '@island.is/island-ui/core'

import { ContentContainer } from '@island.is/financial-aid-web/osk/src/components'
import { useRouter } from 'next/router'
import { Routes } from '@island.is/financial-aid/shared/lib'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

const HasApplied = () => {
  const { user } = useContext(AppContext)
  const router = useRouter()

  return (
    <ContentContainer>
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
    </ContentContainer>
  )
}

export default HasApplied
