import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@island.is/auth/react'
import { APPLICANT_DELEGATIONS } from '@island.is/application/graphql'
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
import { ActorValidationFailedProblem, findProblemInApolloError, ProblemType } from '@island.is/shared/problem'
import { ErrorShell } from './ErrorShell'

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
  applicationId: string
}

export const DelegationsScreen = ({
  type,
  setDelegationsChecked,
  applicationId,
}: DelegationsScreenProps) => {
  const [allowedDelegations, setAllowedDelegations] = useState<string[]>()
  const [applicant, setApplicant] = useState<Delegation>()

  const { switchUser} = useAuth()

  // Check if template supports delegations
  useEffect(() => {
    async function checkDelegations() {
      if (type) {
        const template = await getApplicationTemplateByTypeId(type)
        if (template.allowedDelegations) {
          setAllowedDelegations(template.allowedDelegations)
        }
      } else {
        setDelegationsChecked(true)
      }
    }
    checkDelegations()
  }, [type])

  // Only check if user has delegations if the template supports delegations
  const { data: delegations, error, loading  } = useQuery(
    APPLICANT_DELEGATIONS, {
      variables: {
        input: {
          id: applicationId,
        },
      },
      // Setting this so that refetch causes a re-render
      // https://github.com/apollographql/react-apollo/issues/321#issuecomment-599087392
      // We want to refetch after setting the application back to 'draft', so that
      // it loads the correct form for the 'draft' state.
      skip: !applicationId,
    })
  

  // Check if user has the delegations of the delegation types the application supports
  useEffect(() => {
    console.log("ERROR", error)
    const foundError = findProblemInApolloError(error, [ProblemType.ACTOR_VALIDATION_FAILED])
    console.log(foundError)
    if (delegations && allowedDelegations && foundError?.type === ProblemType.ACTOR_VALIDATION_FAILED) {
      const problem: ActorValidationFailedProblem  = foundError
      // Does the actor have delegation for the applicant of the application
      const found: Delegation = delegations.authActorDelegations.find(
        (delegation: Delegation) =>
          delegation.from.nationalId === problem.fields.delegatedUser &&
          allowedDelegations.includes(delegation.type), // &&
        // problem.fields.delegationType === delegation.type,
      )
      if (!found) setDelegationsChecked(true)
      setApplicant(found)
    }
  }, [delegations, allowedDelegations, error])

  const handleClick = (nationalId?: string) => {
    // history.push(`../${applicationId}/?delegationChecked=true`)
    if (nationalId) switchUser(nationalId)
    else setDelegationsChecked(true)
  }
  // TODO: Set delegated user as default, are the others disabled?
  if (!loading && applicant) {
    return (
      <Page>
        <GridContainer>
          <Box>
            <Box marginTop={5} marginBottom={5}>
              <Text variant="h1">
                Þessi umsókn var hafinn fyrir {applicant.from.name}
              </Text>
            </Box>

            <Box
              marginTop={5}
              marginBottom={5}
              display="flex"
              justifyContent="flexEnd"
              key={applicant.from.nationalId}
            >
              <Text variant="h1">{applicant.from.name}</Text>
              <Button onClick={() => handleClick(applicant.from.nationalId)}>
                Halda áfram
              </Button>
            </Box>
          </Box>
        </GridContainer>
      </Page>
    )
  }
  if(error) return <ErrorShell />
  
  return <LoadingShell />
}
