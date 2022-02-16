import * as styles from './DelegationsScreen.css'
import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@island.is/auth/react'
import { ACTOR_DELEGATIONS } from '@island.is/application/graphql'
import {
  Text,
  Box,
  Page,
  Button,
  GridContainer,
} from '@island.is/island-ui/core'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { ApplicationTypes } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'


type Delegation = {
  type: string
  from: {
    nationalId: string
    name: string
  }
}

export const DelegationsScreen = (type: ApplicationTypes, checked:void) => {
  const { formatMessage } = useLocale()
  const [allowedDelegations, setAllowedDelegations] = useState<string[]>()
  // const [actorDelegations, setActorDelegations] = useState<Delegation[]>()

  const { switchUser } = useAuth()

  // Check if template supports delegations
  useEffect(() => {
    async function checkDelegations() {
      if (type) {
        const template = await getApplicationTemplateByTypeId(type)
        if (template.allowedDelegations) {
          setAllowedDelegations(template.allowedDelegations)
        }
      }
    }
    checkDelegations()
  }, [type])

  // Only check if user has delegations if the template supports delegations
  const {
    data: delegations,
    error: delegationError,
  } = useQuery(ACTOR_DELEGATIONS, { skip: !allowedDelegations })


   // Check if user has the delegations of the delegation types the application supports
  // useEffect(() => {
  //   if (delegations && allowedDelegations && !actorDelegations) {
  //     console.log(allowedDelegations)
  //     console.log(delegations.authActorDelegations)
  //     const del: Delegation[] = delegations.authActorDelegations.filter(
  //       (delegation: Delegation) =>
  //         allowedDelegations.includes(delegation.type),
  //     )
  //     setActorDelegations(del)
  //     console.log('actor del', actorDelegations, typeof del, del)
  //   }
  // }, [delegations, allowedDelegations])

  
  return (
    <Page>
    <GridContainer>
      <Box>
        <Box marginTop={5} marginBottom={5}>
          <Text variant="h1">Þessi umsókn styður umboð.</Text>
        </Box>
        {delegations.authActorDelegations.map((delegation: Delegation) => {
          if (allowedDelegations && allowedDelegations.includes(delegation.type)) {
            return (
              <Box
                marginTop={5}
                marginBottom={5}
                display="flex"
                justifyContent="flexEnd"
                key={delegation.from.nationalId}
              >
                <Text variant="h1">{delegation.from.name}</Text>
                <Button onClick={() =>switchUser(delegation.from.nationalId)}>
                  Skipta um notenda
                </Button>
              </Box>
            )
          }
        })}
      </Box>
    </GridContainer>
  </Page>
  )
}
