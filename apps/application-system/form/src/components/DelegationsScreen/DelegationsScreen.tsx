import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@island.is/auth/react'
import { ACTOR_DELEGATIONS } from '@island.is/application/graphql'
import {  useHistory } from 'react-router-dom'
import {
  Text,
  Box,
  Page,
  Button,
  GridContainer,
} from '@island.is/island-ui/core'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { ApplicationTypes } from '@island.is/application/core'
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
  slug: string
}

export const DelegationsScreen = ({
  type,
  setDelegationsChecked,
  slug,
}: DelegationsScreenProps) => {
  const [allowedDelegations, setAllowedDelegations] = useState<string[]>()
  const history = useHistory()

  const { switchUser, userInfo: user } = useAuth()

  // Check if template supports delegations
  useEffect(() => {
    async function checkDelegations() {
      if (type) {
        const template = await getApplicationTemplateByTypeId(type)
        if (template.allowedDelegations) {
          setAllowedDelegations(template.allowedDelegations)
        } else {
          if (user?.profile.actor) switchUser(user?.profile.actor.nationalId)
          setDelegationsChecked(true)
        }
      }
    }
    checkDelegations()
  }, [type])

  // Only check if user has delegations if the template supports delegations
  const {
    data: delegations,
  } = useQuery(ACTOR_DELEGATIONS, { skip: !allowedDelegations })

  // Check if user has the delegations of the delegation types the application supports
  useEffect(() => {
    if (delegations && allowedDelegations) {
      const authActorDelegations: Delegation[] = delegations.authActorDelegations.map(
        (delegation: Delegation) => {
          if (allowedDelegations.includes(delegation.type)) {
            return delegation
          }
        },
      )
      if (authActorDelegations.length <= 0) setDelegationsChecked(true)
    }
  }, [delegations, allowedDelegations])

  const handleClick = (nationalId?: string) => {
    history.push(`../${slug}/?delegationChecked=true`)
    if (nationalId) switchUser(nationalId)
    else setDelegationsChecked(true)
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
              <Text variant="h1">
                {user.profile.actor
                  ? user.profile.actor.name
                  : user.profile.name}
              </Text>
              <Button
                onClick={() =>
                  handleClick(
                    user.profile.actor
                      ? user.profile.actor.nationalId
                      : undefined,
                  )
                }
              >
                Skipta um notenda
              </Button>
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
                      onClick={() =>
                        handleClick(
                          user.profile.nationalId != delegation.from.nationalId
                            ? delegation.from.nationalId
                            : undefined,
                        )
                      }
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
