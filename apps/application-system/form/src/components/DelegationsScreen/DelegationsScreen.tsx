import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@island.is/auth/react'
import { ACTOR_DELEGATIONS } from '@island.is/application/graphql'
import { useHistory } from 'react-router-dom'
import {
  Text,
  Box,
  GridContainer,
  ActionCard,
  Stack,
  Page,
} from '@island.is/island-ui/core'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { ApplicationTypes } from '@island.is/application/core'
import { ApplicationLoading } from '../ApplicationsLoading/ApplicationLoading'
import { format as formatKennitala } from 'kennitala'

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

  // Check if application supports delegations
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

  // Check for user delegations if application supports delegations
  const { data: delegations } = useQuery(ACTOR_DELEGATIONS, {
    skip: !allowedDelegations,
  })

  // Check for user delegation types supported by the application
  useEffect(() => {
    if (delegations && allowedDelegations) {
      const authActorDelegations: Delegation[] = delegations.authActorDelegations.map(
        (delegation: Delegation) => {
          return allowedDelegations.includes(delegation.type) ?? delegation
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

  return delegations && user ? (
    <Page>
      <GridContainer>
        <Box marginTop={5} marginBottom={5}>
          <Text marginBottom={2} variant="h1">
            Veldu notanda
          </Text>
          <Text>
            Þessi umsókn styður... lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Eget eget diam eget rutrum vestibulum, amet, lacus.
            Ornare volutpat massa ac gravida pellentesque.
          </Text>
        </Box>
        <Stack space={2}>
          <ActionCard
            avatar
            heading={
              user.profile.actor ? user.profile.actor?.name : user.profile.name
            }
            text={
              'Kennitala: ' +
              (user.profile.actor
                ? formatKennitala(user.profile.actor?.nationalId)
                : formatKennitala(user.profile.nationalId))
            }
            cta={{
              label: 'Hefja umsókn',
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
          {delegations.authActorDelegations.map((delegation: Delegation) => {
            return (
              allowedDelegations &&
              allowedDelegations.includes(delegation.type) && (
                <ActionCard
                  key={delegation.from.nationalId}
                  avatar
                  heading={delegation.from.name}
                  text={
                    'Kennitala: ' + formatKennitala(delegation.from.nationalId)
                  }
                  cta={{
                    label: 'Hefja umsókn',
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
            )
          })}
        </Stack>
      </GridContainer>
    </Page>
  ) : (
    <ApplicationLoading />
  )
}
