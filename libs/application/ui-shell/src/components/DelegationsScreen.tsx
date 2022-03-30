import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@island.is/auth/react'
import {
  ACTOR_DELEGATIONS,
  APPLICANT_DELEGATIONS,
} from '@island.is/application/graphql'
import {
  Text,
  Box,
  Page,
  ActionCard,
  GridContainer,
} from '@island.is/island-ui/core'
import { coreDelegationsMessages } from '@island.is/application/core'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { ApplicationTypes } from '@island.is/application/core'
import { LoadingShell } from './LoadingShell'
import {
  BadSubjectProblem,
  findProblemInApolloError,
  ProblemType,
} from '@island.is/shared/problem'
import { ErrorShell } from './ErrorShell'
import { format as formatKennitala } from 'kennitala'
import { useLocale } from '@island.is/localization'

type Delegation = {
  type: string
  from: {
    nationalId: string
    name: string
  }
}
interface DelegationsScreenProps {
  alternativeSubjects: { nationalId: string }[]
  setDelegationsChecked: Dispatch<SetStateAction<boolean>>
  applicationId: string
}

export const DelegationsScreen = ({
  alternativeSubjects,
  setDelegationsChecked,
  applicationId,
}: DelegationsScreenProps) => {
  const [allowedDelegations, setAllowedDelegations] = useState<string[]>()
  const [applicant, setApplicant] = useState<Delegation>()
  const { formatMessage } = useLocale()

  const { switchUser } = useAuth()

  // Check for user delegations if application supports delegations
  const { data: delegations, loading } = useQuery(ACTOR_DELEGATIONS, {
    skip: !allowedDelegations,
  })

  // Check if user has the delegations of the delegation types the application supports
  useEffect(() => {
    if (delegations && alternativeSubjects) {
      const found: Delegation = delegations.authActorDelegations.find(
        (delegation: Delegation) =>
          alternativeSubjects.includes({
            nationalId: delegation.from.nationalId,
          }),
      )
      if (!found) {
        setDelegationsChecked(true)
      } else {
        setApplicant(found)
      }
    }

  }, [alternativeSubjects, delegations])

  const handleClick = (nationalId?: string) => {
    if (nationalId) switchUser(nationalId)
    else setDelegationsChecked(true)
  }
  if (!loading && applicant) {
    return (
      <Page>
        <GridContainer>
          <Box>
            <Box marginTop={5} marginBottom={5}>
              <Text marginBottom={2} variant="h1">
                {formatMessage(
                  coreDelegationsMessages.delegationScreenTitleForOngoingApplication,
                )}
              </Text>
              <Text>
                {formatMessage(
                  coreDelegationsMessages.delegationScreenSubtitleForOngoingApplication,
                )}
              </Text>
            </Box>

            <ActionCard
              avatar
              heading={applicant.from.name}
              text={'Kennitala: ' + formatKennitala(applicant.from.nationalId)}
              cta={{
                label: 'Halda áfram',
                variant: 'text',
                size: 'medium',
                onClick: () => handleClick(applicant.from.nationalId),
              }}
            />
          </Box>
        </GridContainer>
      </Page>
    )
  }
  if (!loading && !applicant) {
    return <ErrorShell />
  }

  return <LoadingShell />
}
