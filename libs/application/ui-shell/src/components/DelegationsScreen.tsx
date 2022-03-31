import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@island.is/auth/react'
import { ACTOR_DELEGATIONS } from '@island.is/application/graphql'
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
  type: ApplicationTypes
  alternativeSubjects: { nationalId: string }[]
  setDelegationsChecked: Dispatch<SetStateAction<boolean>>
}

export const DelegationsScreen = ({
  type,
  alternativeSubjects,
  setDelegationsChecked,
}: DelegationsScreenProps) => {
  const [allowedDelegations, setAllowedDelegations] = useState<string[]>()
  const [applicant, setApplicant] = useState<Delegation>()
  const { formatMessage } = useLocale()

  const { switchUser } = useAuth()

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

  // Check for user delegations if application supports delegations
  const { data: delegations, loading } = useQuery(ACTOR_DELEGATIONS, {
    skip: !alternativeSubjects,
  })

  // Check if user has the delegations of the delegation types the application supports
  useEffect(() => {
    if (delegations && alternativeSubjects && allowedDelegations) {
      const subjects: string[] = alternativeSubjects.map(
        (subject) => subject.nationalId,
      )
      const found: Delegation = delegations.authActorDelegations.find(
        (delegation: Delegation) =>
          subjects.includes(delegation.from.nationalId) &&
          allowedDelegations.includes(delegation.type),
      )
      if (!found) {
        setDelegationsChecked(true)
      } else {
        setApplicant(found)
      }
    }
  }, [alternativeSubjects, delegations, allowedDelegations])

  const handleClick = (nationalId?: string) => {
    if (nationalId) {
      switchUser(nationalId)
    } else {
      setDelegationsChecked(true)
    }
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
