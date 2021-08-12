import React, { useState, useContext } from 'react'
import {
  Text,
  Icon,
  Box,
  Checkbox,
  GridContainer,
} from '@island.is/island-ui/core'

import {
  FormContentContainer,
  FormFooter,
  FormLayout,
  LogoHfj,
} from '@island.is/financial-aid-web/osk/src/components'
import * as styles from './hasApplied.treat'
import { useRouter } from 'next/router'

import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'

const HasApplied = () => {
  const router = useRouter()
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
