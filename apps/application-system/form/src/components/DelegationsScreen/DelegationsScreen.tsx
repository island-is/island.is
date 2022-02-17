import * as styles from './DelegationsScreen.css'
import React, { Dispatch, SetStateAction, useEffect, useState, useCallback } from 'react'
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
import { ApplicationLoading } from '../ApplicationsLoading/ApplicationLoading'

type Delegation = {
  type: string
  from: {
    nationalId: string
    name: string
  }
}
interface DelegationsScreenProps {
  type: ApplicationTypes
  setDelegationsChecked: Dispatch<SetStateAction<boolean>>
  delegationsChecked: boolean
}

export const DelegationsScreen = ({
  type,
  setDelegationsChecked,
  delegationsChecked
}: DelegationsScreenProps) => {
  const { formatMessage } = useLocale()
  const [allowedDelegations, setAllowedDelegations] = useState<string[]>()
  // const [actorDelegations, setActorDelegations] = useState<Delegation[]>()

  const { switchUser, userInfo: user } = useAuth()

  // Check if template supports delegations
  useEffect(() => {
    async function checkDelegations() {
      if (type) {
        const template = await getApplicationTemplateByTypeId(type)
        if (template.allowedDelegations) {
          setAllowedDelegations(template.allowedDelegations)
        } else {
          setDelegationsChecked(true)
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
  useEffect(() => {
    if (delegations && allowedDelegations) {
      console.log(allowedDelegations)
      console.log(delegations.authActorDelegations)
      const del: Delegation[] = delegations.authActorDelegations.map(
        (delegation: Delegation) => {

          if(allowedDelegations.includes(delegation.type)) {
            if(delegation.from.nationalId === user?.profile.nationalId) {
              setDelegationsChecked(false)
            }
            return delegation
          }
        }
      )
      console.log(del)
    }
  }, [delegations, allowedDelegations])

  const setDelegations = useCallback(() => {
    setDelegationsChecked(true)
  }, [setDelegationsChecked])

  const handleClick = (nationalId?: string) => {
    if (nationalId) switchUser(nationalId)
    setDelegations()
    console.log("hi", delegationsChecked)

  }

  if (delegations && user) {
    return (
      <Page>
        <GridContainer>
          <Box>
            <Box marginTop={5} marginBottom={5}>
              <Text variant="h1">Þessi umsókn styður umboð.</Text>
            </Box>
            <Box
              marginTop={5}
              marginBottom={5}
              display="flex"
              justifyContent="flexEnd"
            >
              <Text variant="h1">{user.profile.actor? user.profile.actor.name : user.profile.name}</Text>
              <Button onClick={() => handleClick(user.profile.actor ? user.profile.actor.nationalId : undefined)}>Skipta um notenda</Button>
            </Box>
            {delegations.authActorDelegations.map((delegation: Delegation) => {
              if (
                allowedDelegations &&
                allowedDelegations.includes(delegation.type)
              ) {
                return (
                  <Box
                    marginTop={5}
                    marginBottom={5}
                    display="flex"
                    justifyContent="flexEnd"
                    key={delegation.from.nationalId}
                  >
                    <Text variant="h1">{delegation.from.name}</Text>
                    <Button
                      onClick={() => handleClick(user.profile.nationalId != delegation.from.nationalId? delegation.from.nationalId : undefined)}
                    >
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
  return <ApplicationLoading />
}
