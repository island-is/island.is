import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@island.is/auth/react'
import { ACTOR_DELEGATIONS } from '@island.is/application/graphql'
import { useHistory } from 'react-router-dom'
import {
  Text,
  Box,
  Page,
  Button,
  GridContainer,
} from '@island.is/island-ui/core'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { ApplicationTypes } from '@island.is/application/core'
import { LoadingShell } from './LoadingShell'
import { ValidationFailedProblem } from '@island.is/shared/problem'

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
  problem: ValidationFailedProblem
}

export const DelegationsScreen = ({
  type,
  setDelegationsChecked,
  problem,
}: DelegationsScreenProps) => {
  const [allowedDelegations, setAllowedDelegations] = useState<string[]>()
  const [applicant, setApplicant] = useState<Delegation>()

  const { switchUser, userInfo: user } = useAuth()

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
  const { data: delegations } = useQuery(ACTOR_DELEGATIONS, {
    skip: !allowedDelegations,
  })

  // Check if user has the delegations of the delegation types the application supports
  useEffect(() => {
    if (delegations && allowedDelegations) {
      // Does the actor have delegation for the applicant of the application
      const found: Delegation = delegations.authActorDelegations.find(
        (delegation: Delegation) =>
          delegation.from.nationalId === problem.fields.applicant &&
          allowedDelegations.includes(delegation.type), // &&
        // problem.fields.delegationType === delegation.type,
      )
      if (!found) setDelegationsChecked(true)
      setApplicant(found)
    }
  }, [delegations, allowedDelegations, problem])

  const handleClick = (nationalId?: string) => {
    // history.push(`../${applicationId}/?delegationChecked=true`)
    if (nationalId) switchUser(nationalId)
    else setDelegationsChecked(true)
  }
  // TODO: Set delegated user as default, are the others disabled?
  if (delegations && user) {
    return (
      <Page>
        <GridContainer>
          <Box>
            <Box marginTop={5} marginBottom={5}>
              <Text variant="h1">?essi ums'okn .</Text>
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
                      disabled={
                        delegation.from.nationalId ===
                        applicant?.from.nationalId
                          ? false
                          : true
                      }
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
  return <LoadingShell />
}
