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
  Stack,
} from '@island.is/island-ui/core'
import {
  coreDelegationsMessages,
  getTypeFromSlug,
} from '@island.is/application/core'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { ApplicationTypes } from '@island.is/application/core'
import { LoadingShell } from './LoadingShell'
import { ErrorShell } from './ErrorShell'
import { format as formatKennitala } from 'kennitala'
import { useLocale } from '@island.is/localization'
import { useHistory } from 'react-router-dom'

type Delegation = {
  type: string
  from: {
    nationalId: string
    name: string
  }
}
interface DelegationsScreenProps {
  alternativeSubjects?: { nationalId: string }[]
  setDelegationsChecked: Dispatch<SetStateAction<boolean>>
  slug: string
}

export const DelegationsScreen = ({
  slug,
  alternativeSubjects,
  setDelegationsChecked,
}: DelegationsScreenProps) => {
  const [allowedDelegations, setAllowedDelegations] = useState<string[]>()
  const [applicant, setApplicant] = useState<Delegation>()
  const [actorDelegations, setActorDelegations] = useState<Delegation[]>()
  const { formatMessage } = useLocale()
  const type = getTypeFromSlug(slug)
  const { switchUser, userInfo: user } = useAuth()
  const history = useHistory()

  useEffect(() => {
    async function checkDelegations() {
      if (type) {
        const template = await getApplicationTemplateByTypeId(type)
        if (template.allowedDelegations) {
          setAllowedDelegations(template.allowedDelegations)
        } else {
          if (user?.profile.actor) {
            switchUser(user?.profile.actor.nationalId)
          }
          setDelegationsChecked(true)
        }
      }
    }
    checkDelegations()
  }, [type])

  // Check for user delegations if application supports delegations
  const { data: delegations, loading } = useQuery(ACTOR_DELEGATIONS, {
    skip: !alternativeSubjects && !allowedDelegations,
  })

  // Check if user has the delegations of the delegation types the application supports
  useEffect(() => {
    if (delegations && allowedDelegations) {
      const authActorDelegations: Delegation[] = delegations.authActorDelegations.filter(
        (delegation: Delegation) =>
          allowedDelegations.includes(delegation.type),
      )
      if (authActorDelegations.length <= 0) {
        setDelegationsChecked(true)
      } else {
        if (alternativeSubjects) {
          const subjects: string[] = alternativeSubjects.map(
            (subject) => subject.nationalId,
          )
          const found: Delegation = delegations.authActorDelegations.find(
            (delegation: Delegation) =>
              subjects.includes(delegation.from.nationalId),
          )
          setApplicant(found)
        } else {
          setActorDelegations(authActorDelegations)
        }
      }
    }
  }, [delegations, allowedDelegations])

  const handleClick = (nationalId?: string) => {
    if(!applicant) {
      history.push(`../${slug}/?delegationChecked=true`)
    }
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
  if (!loading && actorDelegations && user) {
    return (
      <Page>
        <GridContainer>
          <Box marginTop={5} marginBottom={5}>
            <Text marginBottom={2} variant="h1">
              {formatMessage(coreDelegationsMessages.delegationScreenTitle)}
            </Text>
            <Text>
              {formatMessage(coreDelegationsMessages.delegationScreenSubtitle)}
            </Text>
          </Box>
          <Stack space={2}>
            <ActionCard
              avatar
              heading={
                user.profile.actor
                  ? user.profile.actor?.name
                  : user.profile.name
              }
              text={
                formatMessage(
                  coreDelegationsMessages.delegationActionCardText,
                ) +
                (user.profile.actor
                  ? formatKennitala(user.profile.actor?.nationalId)
                  : formatKennitala(user.profile.nationalId))
              }
              cta={{
                label: formatMessage(
                  coreDelegationsMessages.delegationActionCardButton,
                ),
                variant: 'text',
                size: 'medium',
                onClick: () =>
                  handleClick(
                    user.profile.actor
                      ? user.profile.actor.nationalId
                      : undefined,
                  ),
              }}
            />
            {actorDelegations.map((delegation: Delegation) => {
              return (
                <ActionCard
                  key={delegation.from.nationalId}
                  avatar
                  heading={delegation.from.name}
                  text={
                    formatMessage(
                      coreDelegationsMessages.delegationActionCardText,
                    ) + formatKennitala(delegation.from.nationalId)
                  }
                  cta={{
                    label: formatMessage(
                      coreDelegationsMessages.delegationActionCardButton,
                    ),
                    variant: 'text',
                    size: 'medium',
                    onClick: () =>
                      handleClick(
                        user.profile.nationalId !== delegation.from.nationalId
                          ? delegation.from.nationalId
                          : undefined,
                      ),
                  }}
                />
              )
            })}
          </Stack>
        </GridContainer>
      </Page>
    )
  }
  if (!loading && !applicant && !actorDelegations) {
    return <ErrorShell />
  }

  return <LoadingShell />
}
